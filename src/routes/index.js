/**
 * @autor Laisson R. Silveira<laisson.silveira@digitro.com>
 *
 * Created on 23/05/2019
 */
const express = require('express');
const router = express.Router();
const LOGGER = require('../lib/logger');
const Utils = require('../lib/utils');

module.exports = authentication => {
    /**
     * @api {get} http://localhost:3000/cpf-validate/status Status
     * @apiDescription Informa o status do serviço cpf-validate
     * @apiName status
     * @apiGroup Index
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} Example usage:
     *  curl -X GET 'http://localhost:3000/cpf-validatez/status'\
     *  -H 'Authorization: Basic YWRtaW46YWRtaW5wd2Q='
     *
     * @apiSuccess (Success) {String} pid ID do processo que está rodando o servidor
     * @apiSuccess (Success) {String} nodeVersion Versão do node
     * @apiSuccess (Success) {String} uptime Tempo em que o serviço está em execução (segundos)
     * @apiSuccess (Success) {Object} memoryUsage Dados de uso de memória do serviço
     * @apiSuccess (Success) {String} memoryUsage.rss Tamanho do conjunto
     * @apiSuccess (Success) {String} memoryUsage.heapTotal Tamanho total do heap
     * @apiSuccess (Success) {String} memoryUsage.heapUsed Heap realmente usado
     *
     * @apiSuccessExample {json} Success-Response
     * {
     *      "pid": 13760,
     *      "nodeVersion": "8.16.0",
     *      "uptime": "3 seconds",
     *      "memoryUsage": {
     *          "rss": "50.72 MB",
     *          "heapTotal": "24.13 MB",
     *          "heapUsed": "14.39 MB"
     *      }
     * }
     */
    router.get('/status', authentication, (req, res) => {
        LOGGER.info('[API-INDEX] Recuperando status do serviço cpf-validate');
        const { pid, uptime, versions, memoryUsage } = process;
        const { rss, heapTotal, heapUsed } = memoryUsage();
        res.json({
            pid, nodeVersion: versions.node, uptime: `${Math.floor(process.uptime(uptime))} seconds`,
            memoryUsage: { rss: Utils.formatBytes(rss), heapTotal: Utils.formatBytes(heapTotal), heapUsed: Utils.formatBytes(heapUsed) }
        });
    });

    return router;
};