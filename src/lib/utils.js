'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 */
const moment = require('moment-timezone');
const crypto = require('crypto');
moment.locale('pt-br');

const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

class Utils {

    static dateFormat() {
        return moment().tz('America/Sao_Paulo').format('L LTS');
    }

    static createHash(data, algorithm = 'sha1', encoding = 'hex') {
        return crypto.createHash(algorithm).update(data, 'utf8').digest(encoding);
    }

    static configPassport() {
        const LOGGER = require('../lib/logger');
        const UsersCtrl = require('../controllers/UsersCtrl');
        passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, async (username, password, cb) => {
            LOGGER.info(`[PASSPORT] Validating login for user '${username}'`);
            try {
                const user = await UsersCtrl.find(username);
                if (!user || !user.comparePassword(password)) {
                    cb(null, false, { message: 'Usuário ou Senha incorreta' });
                }
                cb(null, user, { message: 'Login efetuado com sucesso' });
            } catch (err) {
                cb(err);
            }
        }));
        passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: __CONFIG.secretKey
        }, async (jwtPayload, cb) => {
            try {
                const userID = jwtPayload._id;
                LOGGER.info(`[PASSPORT] Validating token for user '${userID}'`);
                const user = await UsersCtrl.findById(userID);
                cb(null, user);
            } catch (err) {
                cb(err);
            }
        }));
    }

    /**
       * Método para remover todos caracteres deixando apenas os números
       *
       * @author Laisson R. Silveira
       * @static
       * @param {string} str Texto a ser removido os caracteres
       * @return {string} Texto com somente números
       */
    static convertStringToOnlyNumber(str) {
        if (!str) return '';
        return str.replace(/[^\d]+/g, '');
    }

    /**
     * Valida CPF
     *
     * @author Laisson R. Silveira
     * @static
     * @param {string} cpf - O CPF com ou sem pontos e traços
     * @return {object} Object com dados se é valido e se inválido com a mensagem do erro
     * @example
     *  {isValid: true, cpf: '00000000000'}
     *  {isValid: false, error: {[message]}}
     */
    static validateCPF(cpf) {

        if (!cpf) return {
            isValid: false,
            message: 'O número do CPF não foi informado.'
        };

        // Remove caracteres inválidos do CPF
        cpf = Utils.convertStringToOnlyNumber(cpf.toString());

        if (!cpf) return {
            isValid: false,
            message: 'O número do CPF não é numérico.'
        };

        // Elimina CPFs inválidos conhecidos
        if (cpf.length !== 11 ||
            cpf === '00000000000' ||
            cpf === '11111111111' ||
            cpf === '22222222222' ||
            cpf === '33333333333' ||
            cpf === '44444444444' ||
            cpf === '55555555555' ||
            cpf === '66666666666' ||
            cpf === '77777777777' ||
            cpf === '88888888888' ||
            cpf === '99999999999')
            return {
                isValid: false,
                message: 'O número do CPF é inválido.'
            };

        // Captura os 9 primeiros dígitos do CPF
        // Ex.: 02546288423 = 025462884
        const digits = cpf.substr(0, 9);

        // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
        let newCPF = Utils._positionDigitsCalc(digits);

        // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
        newCPF = Utils._positionDigitsCalc(newCPF, 11);

        // Verifica se o novo CPF gerado é idêntico ao CPF enviado
        if (newCPF !== cpf) return {
            isValid: false,
            message: 'O número do CPF é inválido.'
        };

        return { isValid: true };
    }

    /**
     * Calcular posição dos dígitros para validação do CPF
     *
     * @author Laisson R. Silveira
     *
     * @param {string} digits - Os digitos desejados
     * @param {number} positions - A posição que vai iniciar a regressão
     * @param {number} digitsSum - A soma das multiplicações entre posições e dígitos
     * @return {string} Os dígitos enviados concatenados com o último dígito
     * @private
     */
    static _positionDigitsCalc(digits, positions = 10, digitsSum = 0) {

        // Garante que o valor é uma string
        digits = digits.toString();

        /**
         * Faz a soma dos dígitos com a posição
         *
         * @example Para 10 posições:
         *   0    2    5    4    6    2    8    8   4
         * x10   x9   x8   x7   x6   x5   x4   x3  x2
         * ---  ---  ---  ---  ---  ---  ---  ---  ---
         *   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
         */
        for (let digit of digits) {
            // Preenche a soma com o dígito vezes a posição
            digitsSum = digitsSum + (digit * positions);
            // Subtrai 1 da posição
            positions--;
        }

        // Captura o resto da divisão entre digitsSum dividido por 11
        // Ex.: 196 % 11 = 9
        digitsSum = digitsSum % 11;

        /**
         * Verifica se digitsSum é menor que 2
         *
         * Se for maior que 2, o resultado é 11 menos digitsSum
         * Ex.: 11 - 9 = 2
         * Nosso dígito procurado é 2
         */
        digitsSum < 2 ? digitsSum = 0 : digitsSum = 11 - digitsSum;

        // Concatena mais um dígito aos primeiro nove dígitos
        // Ex.: 025462884 + 2 = 0254628842
        return digits + digitsSum;
    }
}

module.exports = Utils;