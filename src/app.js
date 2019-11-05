'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { join } = require('path');
const Errors = require('./lib/errors');
const LOGGER = require('./lib/logger');
const Utils = require('./lib/utils');

const supportRouter = require('./routes/support');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const blacklistRouter = require('./routes/blacklist');

const app = express();
Utils.configPassport();

app.set('view engine', 'html');
app.use('/cpf-validate', express.static(join(__dirname, 'public')));
app.use('/cpf-validate/suporte', express.static(join(__dirname, 'support')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET', 'DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

// Bundle routes
app.use('/cpf-validate/auth', authRouter);
app.use('/cpf-validate/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/cpf-validate/blacklist', passport.authenticate('jwt', { session: false }), blacklistRouter);
app.use('/cpf-validate/suporte', Utils.authenticationIndex, supportRouter);
LOGGER.info('[APP] Rotas configuradas');

// Config Errors
app.use(Errors.logErrors);
app.use(Errors.clientErrorHandler);

module.exports = app;
