'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 *
 * API /auth
 * @apiDefine Unauthorized
 * @apiError {String} Unauthorized
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 401 Unauthorized
 */
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const LOGGER = require('../lib/logger');

/**
 * @api {post} http://localhost:3000/api/auth/login Autenticação
 * @apiDescription Authenticação do usuário
 * @apiName login
 * @apiGroup cpf-validate
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X POST \
 *    'http://localhost:3000/api/auth/login' \
 *      -H 'Content-Type: application/json' \
 *      -d '{
 *      	"username": "usuario",
 *      	"password": "senha"
 *      }'
 *
 * @apiParam {String} username Usuário de acesso
 * @apiParam {String} password Senha de acesso
 * @apiParamExample {json} Request-Example:
 *  {
 *  	"username": "usuario",
 *  	"password": "senha"
 *  }
 *
 * @apiSuccess {String} token Token de acesso do usuário
 * @apiSuccessExample {json} Success-Response
 * {
 *     "token": "sjdlasjlsdjpweorpw...."
 * }
 *
 *
 * @apiError {String} message Usuário/Senha incorreto
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "Usuário ou Senha incorreta"
 * }
 */
router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            let message = 'Falha ao tentar efetuar o login';
            if (err) message = err.message;
            if (info) message = info.message;
            LOGGER.error(`[auth] ${message}`, err);
            return res.status(400).json({ message });
        }
        req.login(user, { session: false }, err => {
            if (err) return res.send(err);
            const token = jwt.sign(user.toJSON(), __CONFIG.secretKey);
            return res.json({ token });
        });
    })(req, res);
});

module.exports = router;