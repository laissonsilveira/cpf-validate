'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 *
 * API - /users
 */
const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/UsersCtrl');
const LOGGER = require('../lib/logger');

/**
 * @api {get} http://localhost:3000/cpf-validate/users Lista Usuários
 * @apiDescription Lista os usuários
 * @apiName GetUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X GET 'http://localhost:3000/cpf-validate/users' \
*    -H 'Authorization: Bearer CJstk7cypEDwaFW4...' \
 *
 * @apiSuccess {String} id Identificador único do cliente
 * @apiSuccess {String} name Nome do usuário
 * @apiSuccess {String} createdAt Data de criação do usuário
 *
 * @apiSuccessExample {json} Success-Response
 * [
 *   {
 *       "id": "5cdb4ee81fe76800228cfa5b"
 *       "name": "laisson",
 *       "createdAt": "2019-05-14T23:27:36.705Z",
 *   }
 * ]
 *
 * @apiError {String} Unauthorized
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 401 Unauthorized
 */
router.get('/', async (req, res, next) => {
    LOGGER.info('[API-USERS] Searching all users');
    try {
        const user = await UserCtrl.findAll();
        res.json(user);
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} http://localhost:3000/cpf-validate/users/:id Busca Usuário
 * @apiDescription Busca usuário pelo ID
 * @apiName GetUsersID
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X GET 'http://localhost:3000/cpf-validate/users/5cdb4ee81fe76800228cfa5b' \
 *    -H 'Authorization: Bearer CJstk7cypEDwaFW4...'
 *
 * @apiParam {String} id Identificador único do cliente
 *
 * @apiSuccess {String} id Identificador único do cliente
 * @apiSuccess {String} name Nome do usuário
 * @apiSuccess {String} createdAt Data de criação do usuário
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *     "_id": "5cdb4ee81fe76800228cfa5b"
 *     "name": "laisson",
 *     "createdAt": "2019-05-14T23:27:36.705Z",
 * }
 *
 * @apiError {String} message ID inválido
 *
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "ID do usuário (5ce899508f8d4d5f929c11a) inválido"
 * }
 *
 * @apiError {String} Unauthorized
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 401 Unauthorized
 */
router.get('/:id', async (req, res, next) => {
    const userID = req.params.id;
    LOGGER.info(`[API-USERS] Searching for user by ID: '${userID}'`);
    try {
        const user = await UserCtrl.findById(userID);
        res.json(user || {});
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} http://localhost:3000/cpf-validate/users Adiciona Usuário
 * @apiDescription Adiciona um novo usuário
 * @apiName PostUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 * curl -X POST \
 *   'http://localhost:3000/cpf-validate/users' \
 *   -H 'Authorization: Bearer CJstk7cypEDwaFW4...' \
 *   -H 'Content-Type: application/json' \
 *   -d '{
 *         "name": "Um novo usuário",
 *         "username": "novo usuário",
 *         "password": "senhaTeste",
 *       }'
 *
 * @apiParam {String} name Nome do usuário
 * @apiParam {String} username Login de usuário
 * @apiParam {String} password Senha do suário
 *
 * @apiParamExample {json} Request-Example
 * {
 *    "name": "Um novo usuário"
 *    "username": "novo usuário",
 *    "password": "senhaTeste",
 * }
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 *
 * @apiError {String} message Usuário/Senha incorreto
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "Já existe um usuário com este nome."
 * }
 *
 * @apiError {String} Unauthorized
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 401 Unauthorized
 */
router.post('/', async (req, res, next) => {
    const user = req.body;
    LOGGER.info('[API-USERS] Creating a new user');
    try {
        await UserCtrl.save(user);
        LOGGER.info(`[API-USERS] User '${user.name}' saved successfully!`);
        res.end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;