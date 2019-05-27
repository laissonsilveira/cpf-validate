'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const { join } = require('path');
const { existsSync, mkdirSync } = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');
const Utils = require('./utils');
const { NODE_ENV } = process.env;

NODE_ENV !== 'test'
    && !existsSync(__CONFIG.log.directory)
    && mkdirSync(__CONFIG.log.directory);

winston.emitErrs = true;
const config = {
    transports: [
        new winston.transports.Console({
            level: __CONFIG.log.console.level,
            handleExceptions: true,
            json: __CONFIG.log.console.json,
            colorize: __CONFIG.log.console.colorize,
            timestamp: Utils.dateFormat,
            debugStdout: true
        })
    ],
    exitOnError: false
};

NODE_ENV !== 'test'
    && config.transports.push(
        new winston.transports.DailyRotateFile({
            filename: join(__CONFIG.log.directory, 'cpf-validate.log'),
            prepend: true,
            level: __CONFIG.log.file.level,
            handleExceptions: true,
            json: __CONFIG.log.file.json,
            prettyPrint: __CONFIG.log.file.prettyPrint,
            maxsize: __CONFIG.log.file.maxsize,
            maxFiles: __CONFIG.log.file.maxFiles,
            colorize: __CONFIG.log.file.colorize,
            timestamp: Utils.dateFormat
        })
    );

const logger = new winston.Logger(config);
module.exports = logger;
module.exports.stream = {
    write: function (message) {
        logger.info(message);
    }
};