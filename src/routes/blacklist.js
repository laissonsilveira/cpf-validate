'use strict';
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 *
 * API - /blacklist
 *
 * @apiDefine CPF-NaN
 * @apiError {String} message CPF não numérico
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF não é numérico."
 * }
 *
 * @apiDefine CPF-invalid
 * @apiError {String} message CPF inválido
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF é inválido."
 * }
 *
 * @apiDefine CPF-required
 * @apiError {String} message CPF não informado
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número do CPF não foi informado."
 * }
 */
const express = require('express');
const router = express.Router();
const LOGGER = require('../lib/logger');
const BlaclistCtrl = require('../controllers/BlacklistCtrl');

/**
 * @api {get} http://localhost:3000/api/blacklist Consulta CPF
 * @apiDescription Consulta CPF na lista
 * @apiName GetCPF
 * @apiGroup cpf-validate
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X GET 'https://localhost/api/blacklist?cpf=05523549983' \
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
 * @apiUse Unauthorized
 * @apiUse CPF-NaN
 * @apiUse CPF-invalid
 * @apiUse CPF-required
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
 * @api {post} http://localhost:3000/api/blacklist Adiciona CPF
 * @apiDescription Adiciona CPF na lista
 * @apiName PostCPF
 * @apiGroup cpf-validate
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X POST \
 *    'http://localhost:3000/api/blacklist' \
 *    -H 'Authorization: Bearer skdlkjlkje....'
 *    -d '{
 *       	"cpf": "05523549983",
 *       }'
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 *
 * @apiError {String} message CPF existente
 * @apiErrorExample {json} Error-Response
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "message": "O número de CPF já existe."
 * }
 *
 * @apiUse Unauthorized
 * @apiUse CPF-NaN
 * @apiUse CPF-invalid
 * @apiUse CPF-required
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
 * @api {delete} http://localhost:3000/api/blacklist Remove CPF
 * @apiDescription Remove CPF da lista
 * @apiName DeleteCPF
 * @apiGroup cpf-validate
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *  curl -X DELETE \
 *    'http://localhost:3000/api/blacklist/05523549983' \
 *    -H 'Authorization: Bearer skdlkjlkje....'
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 *
 * @apiUse Unauthorized
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