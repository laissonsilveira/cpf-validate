'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 */
const Utils = require('../src/lib/utils');
const { expect } = require('chai');

describe('Validação de CPF', () => {

    _errorValidate('', 'O número do CPF não foi informado.');
    _errorValidate('aaaaaaaaaaaaaaa', 'O número do CPF não é numérico.');

    const invalidCPF = ['123456789', '123.456.789-0', '12345678901234', '00000000000', '11111111111',
        '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777',
        '88888888888', '99999999999', '123.456.780-19'];
    for (const cpf of invalidCPF) {
        _errorValidate(cpf, 'O número do CPF é inválido.');
    }

    const validCPF = '748.545.143-02';
    it(`[${validCPF}] CPF deve ser válido`, () => {
        const result = Utils.validateCPF(validCPF);
        expect(result).to.have.property('isValid').that.is.true;
    });
});

function _errorValidate(cpf, message) {
    it(`[${cpf}] CPF deve ser inválido e deve retornar mensagem '${message}'`, () => {
        const result = Utils.validateCPF(cpf);
        expect(result).to.have.property('isValid').that.is.false;
        expect(result).to.have.property('message').that.equal(message);
    });
}