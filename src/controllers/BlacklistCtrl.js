'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const mongoose = require('mongoose');
const BlacklistModel = mongoose.model('Blacklist');
const CPFError = require('../lib/cpf-error');
const Utils = require('../lib/utils');

class BlaclistCtrl {

    static async findBy(cpf) {
        return await BlacklistModel.findOne({ cpf }).lean();
    }

    static async findAll() {
        return await BlacklistModel.find({ });
    }

    static async save(blacklist) {
        await new BlacklistModel(blacklist).save();
    }

    static async delete(cpf) {
        await BlacklistModel.deleteOne({ cpf });
    }

    static async validate(cpf) {
        const { isValid, message } = Utils.validateCPF(cpf);
        if (!isValid) throw new CPFError(message);
        return true;
    }

}

module.exports = BlaclistCtrl;
