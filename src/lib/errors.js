'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const LOGGER = require('../lib/logger');

class Errors {

    static logErrors(err, req, res, next) {
        LOGGER.error(err.message, err.stack);
        next(err);
    }

    //eslint-disable-next-line
    static clientErrorHandler(err, req, res, next) {
        let message = 'Erro interno no servidor. Contate o administrador.';
        if (err.name === 'CPFError') {
            message = err.message;
        } else if (err.message.includes('E11000')) {
            if (err.message.includes('.users'))
                message = 'Já existe um usuário com este nome.';
            if (err.message.includes('.blacklist'))
                message = 'O número de CPF já existe.';
        }
        res.status(500).send({ message });
    }

}

module.exports = Errors;