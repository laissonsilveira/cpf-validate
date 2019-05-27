'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlacklistSchema = new Schema({
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

module.exports = mongoose.model('Blacklist', BlacklistSchema);