'use strict';
/*eslint no-console: ['error', { allow: ['log', 'error'] }] */
/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2018
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.config.includeStack = false;
const { expect } = chai;
const moment = require('moment');
global.__CONFIG = require('../src/config');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
const HOST_SERVER = `http://localhost:${__CONFIG.server.port}`;

describe('cpf-validate tests', function () {
    let UsersModel, BlacklistModel;
    const user01 = { name: 'User 01', username: 'username01', password: 'userpwd' };
    const user02 = { name: 'User 02', username: 'username02', password: 'userpwd' };

    before(done => {
        mongod = new MongoMemoryServer({
            instance: {
                port: __CONFIG.database.port,
                ip: __CONFIG.database.host,
                dbName: __CONFIG.database.dbName,
                debug: __CONFIG.database.isDebug
            },
            binary: {
                version: '4.0.4'
            },
            debug: false
        });
        // Aguarda 3 segundos para criação do mongo em memória para começar os testes
        console.log('Waiting mongodb start for 3 seconds...');
        setTimeout(async () => {
            await require('../bin/cpf-validate');
            const mongoose = require('mongoose');
            UsersModel = mongoose.model('Users');
            BlacklistModel = mongoose.model('Blacklist');
            done();
        }, 3000);
    });

    after(() => {
        mongod.stop();
    });

    describe.skip('/users', async () => {

        let userSaved, TOKEN;

        beforeEach(async () => {
            userSaved = await new UsersModel(user01).save();
            TOKEN = await getToken(user01, TOKEN);
        });
        afterEach(async () => await UsersModel.collection.drop());

        describe('SUCCESS', () => {

            it('GET /users/:id', async () => {
                const response = await chai
                    .request(HOST_SERVER)
                    .get(`/api/users/${userSaved.id}`)
                    .set('authorization', TOKEN);

                expect(response).to.have.status(200);
                const userResponse = response.body;
                expect(userResponse).that.is.an('object');

                expect(userResponse)
                    .to.have.property('id')
                    .that.is.a('string')
                    .that.equals(userSaved.id);
                expect(userResponse)
                    .to.have.property('name')
                    .that.is.a('string')
                    .that.equals(userSaved.name);

                expect(moment(userResponse.createdAt).format('YYYY-MM-DD'))
                    .that.is.equals(moment().format('YYYY-MM-DD'));
            });

            it('POST /users', async () => {
                const response = await chai
                    .request(HOST_SERVER)
                    .post('/api/users')
                    .send(user02)
                    .set('authorization', TOKEN);

                expect(response).to.have.status(200);
            });

        });

        describe('ERROR', () => {

            it('Usuário existente', async () => {
                const response = await chai.request(HOST_SERVER)
                    .post('/api/users')
                    .send(user01)
                    .set('authorization', TOKEN);
                expect(response).to.have.status(500);
                expect(response.body)
                    .that.is.an('object')
                    .to.have.property('message')
                    .that.is.a('string')
                    .that.equals('Já existe um usuário com este nome.');
            });

            it('Erro genérico - 500', async () => {
                const response = await chai.request(HOST_SERVER)
                    .post('/api/users')
                    .send({})
                    .set('authorization', TOKEN);

                expect(response).to.have.status(500);
                expect(response.body)
                    .that.is.an('object')
                    .to.have.property('message')
                    .that.is.a('string')
                    .that.equals('Erro interno no servidor. Contate o administrador.');
            });

            it('Unauthorized - 401', async () => {
                const response = await chai.request(HOST_SERVER).get('/api/users');
                expect(response).to.have.status(401);
            });

        });

    });

    describe('/blacklist', () => {

        let TOKEN;
        const blacklist01 = { cpf: '488.712.210-10' };
        const blacklist02 = { cpf: '156.552.580-99' };
        const blacklist03 = { cpf: '809.087.650-10' };
        const blacklistInvalid = { cpf: '000.087.000-00' };

        beforeEach(async () => {
            await new UsersModel(user01).save();
            TOKEN = await getToken(user01);
            await new BlacklistModel(blacklist01).save();
        });

        afterEach(async () => {
            await UsersModel.collection.drop();
            await BlacklistModel.collection.drop();
        });

        describe.skip('SUCCESS', () => {

            it('GET /blacklist - BLOCK', async () => {
                await blacklistValidate(blacklist01, 'BLOCK', TOKEN);
            });

            it('GET /blacklist - FREE', async () => {
                await blacklistValidate(blacklist02, 'FREE', TOKEN);
            });

            it('POST /blacklist', async () => {
                const response = await chai.request(HOST_SERVER)
                    .post('/api/blacklist')
                    .send(blacklist03)
                    .set('authorization', TOKEN);
                expect(response).to.have.status(200);

                await blacklistValidate(blacklist03, 'BLOCK', TOKEN);
            });

            it('DELETE /blacklist', async () => {
                const response = await chai.request(HOST_SERVER)
                    .delete(`/api/blacklist/${blacklist01.cpf}`)
                    .set('authorization', TOKEN);
                expect(response).to.have.status(200);

                await blacklistValidate(blacklist01, 'FREE', TOKEN);
            });

        });

        describe('ERROR', () => {

            it.skip('CPF inválido', async () => {
                const response = await chai.request(HOST_SERVER)
                    .post('/api/blacklist')
                    .send(blacklistInvalid)
                    .set('authorization', TOKEN);
                expect(response).to.have.status(500);
                expect(response.body)
                    .that.is.an('object')
                    .to.have.property('message')
                    .that.is.a('string')
                    .that.equals('O número do CPF é inválido.');
            });

            it('CPF existente', async () => {
                await BlacklistModel.init();
                const response = await chai.request(HOST_SERVER)
                    .post('/api/blacklist')
                    .send(blacklist01)
                    .set('authorization', TOKEN);
                expect(response).to.have.status(500);
                expect(response.body)
                    .that.is.an('object')
                    .to.have.property('message')
                    .that.is.a('string')
                    .that.equals('O número de CPF já existe.');
            });

        });

    });

});

const getToken = async user => {
    const response = await chai.request(HOST_SERVER).post('/api/auth/login').send(user);
    return `Bearer ${response.body.token}`;
};

const blacklistValidate = async (blocklist, status, TOKEN) => {
    const response = await chai
        .request(HOST_SERVER)
        .get(`/api/blacklist?cpf=${blocklist.cpf}`)
        .set('authorization', TOKEN);
    expect(response)
        .to.have.status(200);
    const responseCPF = response.body;
    expect(responseCPF)
        .that.is.an('object');
    expect(responseCPF)
        .to.have.property('status')
        .that.equals(status);
};