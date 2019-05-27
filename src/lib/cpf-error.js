'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 */
class CPFError extends Error {
    constructor(message = 'Erro interno no servidor. Contate o administrador.', status = 500) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = CPFError;