'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StatusSchema = new Schema({ totalQuery: { type: Number, default: 0, } }, { versionKey: false });
module.exports = mongoose.model('Status', StatusSchema);