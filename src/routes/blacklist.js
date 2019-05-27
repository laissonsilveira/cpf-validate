'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 *
 * API - /blacklist
 */
const express = require('express');
const router = express.Router();
const LOGGER = require('../lib/logger');
const BlaclistCtrl = require('../controllers/BlacklistCtrl');

/**
 * @api {get} http://localhost:3000/cpf-validate/blacklist Consulta CPF
 * @apiDescription Consulta CPF na lista
 * @apiName GetCPF
 * @apiGroup Blacklist
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X GET 'https://localhost/cpf-validate/blacklist?cpf=05523549983' \
 *      -H 'Authorization: Bearer skdlkjlkje....'
 *
 * @apiParam {String} cpf Número do CPF (Com ou sem separadores)
 *
 * @apiSuccess {String} status Indica se o CPF está cadastrado (FREE=não/BLOCK=sim)
 * @apiSuccessExample {json} Success-Response
 * {
 *  status: 'FREE'
 * }
 *
 * @apiError {String} Unauthorized
 * @apiErrorExample {json} Unauthorized
 * HTTP/1.1 401 Unauthorized
 *
 * @apiError {String} message Mensagem de erro
 * @apiErrorExample {json} CPF não numérico
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF não é numérico."
 * }
 *
 * @apiError {String} message Mensagem de erro
 * @apiErrorExample {json} CPF inválido
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF é inválido."
 * }
 *
 * @apiError {String} message Mensagem de erro
 * @apiErrorExample {json} CPF não informado
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF não foi informado."
 * }
 */
router.get('/', async (req, res, next) => {
    try {
        const { cpf } = req.query;
        await BlaclistCtrl.validate(cpf);
        LOGGER.info(`[API-BLACKLIST] Consulting CPF '${cpf}' on blacklist`);
        const cpfFound = await BlaclistCtrl.findBy(cpf);
        const status = cpfFound ? 'BLOCK' : 'FREE';
        LOGGER.info(`[API-BLACKLIST] Status CPF '${cpf}': ${status}`);
        res.json({ status });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} http://localhost:3000/cpf-validate/blacklist Adiciona CPF
 * @apiDescription Adiciona CPF na lista
 * @apiName PostCPF
 * @apiGroup Blacklist
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X POST \
 *    'http://localhost:3000/cpf-validate/blacklist' \
 *    -H 'Authorization: Bearer skdlkjlkje....'
 *    -d '{
 *       	"cpf": "05523549983",
 *       }'
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 *
 * @apiError {String} message Mensagem de erro
 * @apiErrorExample {json} CPF existente
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número de CPF já existe."
 * }
 *
 * @apiError {String} Unauthorized
 * @apiErrorExample {json} Unauthorized
 * HTTP/1.1 401 Unauthorized
 *
 * @apiError {String} message Mensagem de erro
 * @apiErrorExample {json} CPF não numérico
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF não é numérico."
 * }
 *
 * @apiError {String} message Mensagem de erro
 * @apiErrorExample {json} CPF inválido
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF é inválido."
 * }
 *
 * @apiError {String} message Mensagem de erro
 * @apiErrorExample {json} CPF não informado
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF não foi informado."
 * }
 */
router.post('/', async (req, res, next) => {
    LOGGER.info('[API-BLACKLIST] Adding CPF to blacklist');
    try {
        const blacklist = req.body;
        const { cpf } = blacklist;
        await BlaclistCtrl.validate(cpf);
        await BlaclistCtrl.save(blacklist);
        LOGGER.info(`[API-BLACKLIST] CPF '${cpf}' saved successfully!`);
        res.end();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} http://localhost:3000/cpf-validate/blacklist Remove CPF
 * @apiDescription Remove CPF da lista
 * @apiName DeleteCPF
 * @apiGroup Blacklist
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X DELETE \
 *    'http://localhost:3000/cpf-validate/blacklist/05523549983' \
 *    -H 'Authorization: Bearer skdlkjlkje....'
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 *
 * @apiError {String} Unauthorized
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 401 Unauthorized
 */
router.delete('/:cpf', async (req, res, next) => {
    LOGGER.info('[API-BLACKLIST] Removing CPF from blacklist');
    try {
        const { cpf } = req.params;
        await BlaclistCtrl.delete(cpf);
        LOGGER.info('[API-BLACKLIST] CPF removed from blacklist successfully');
        res.end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;