'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const Utils = require('../lib/utils');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) user.password = Utils.createHash(user.password);
    next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return this.password === Utils.createHash(candidatePassword) || this.password === candidatePassword;
};

module.exports = mongoose.model('Users', UserSchema);