'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const mongoose = require('mongoose');
const BlacklistModel = mongoose.model('Blacklist');
const StatusModel = mongoose.model('Status');
const CPFError = require('../lib/cpf-error');
const Utils = require('../lib/utils');

class BlacklistCtrl {

    static async countQueryCPF() {
        const res = await StatusModel.findOne();
        return res && res.totalQuery || 0;
    }
    
    static async count() {
        return await BlacklistModel.find().countDocuments();
    }

    static async findBy(cpf) {
        await StatusModel.update({}, { $inc: { totalQuery: 1 } });
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

module.exports = BlacklistCtrl;
