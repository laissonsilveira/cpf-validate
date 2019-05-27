'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const mongoose = require('mongoose');
const UsersModel = mongoose.model('Users');
const CPFError = require('../lib/cpf-error');

class UserCtrl {

    static async findAll() {
        const projection = { username: 0, password: 0 };
        const usersFound = await UsersModel.find({}, projection).lean();
        if (Array.isArray(usersFound)) {
            for (const user of usersFound) {
                user.id = user._id.toString();
                delete user._id;
            }
        }
        return usersFound;
    }

    static async findById(userID) {
        if (!userID.match(/^[0-9a-fA-F]{24}$/)) {
            throw new CPFError(`ID do usuário (${userID}) inválido`);
        }
        const projection = { username: 0, password: 0 };
        const userFound = await UsersModel.findById(userID, projection).lean();
        if (userFound) {
            userFound.id = userFound._id.toString();
            delete userFound._id;
        }
        return userFound;
    }

    static async save(user) {
        const newUser = new UsersModel(user);
        await newUser.save();
    }

    static async find(username) {
        username = username && username.toLowerCase();
        const filter = { username: { $ne: 'admin', $eq: username } };
        if (username === 'admin') delete filter.username.$ne;
        return await UsersModel.findOne({ username });
    }

}

module.exports = UserCtrl;
