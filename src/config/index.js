'use strict';
const { join } = require('path');
const { NODE_ENV } = process.env;
const fileName = NODE_ENV !== 'test' ? 'default' : NODE_ENV;
module.exports = require(join(__dirname, fileName));