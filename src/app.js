'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Errors = require('./lib/errors');
const LOGGER = require('./lib/logger');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const blacklistRouter = require('./routes/blacklist');

const app = express();
require('./lib/utils').configPassport();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET', 'DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    next();
});

// Bundle routes
app.use('/api/auth', authRouter);
app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/api/blacklist', passport.authenticate('jwt', { session: false }), blacklistRouter);
LOGGER.info('[APP] Rotas configuradas');

// Config Errors
app.use(Errors.logErrors);
app.use(Errors.clientErrorHandler);

module.exports = app;
