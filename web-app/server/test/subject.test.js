process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const sinon = require('sinon');

const app = require('../app');

describe('Route /subject', () => {

    describe('#POST /subject/create', () => {
        it('should be invalid if subjectName is empty', (done) => {
            request(app)
                .post('/subject/create')
                .set('authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4')
                .send({
                    subjectName: ''
                })
                .then((res) => {
                    expect(res.status).equal(422);
                    expect(res.body.errors[0].msg).equal('Invalid value');
                    done();
                });
        });
    });
});