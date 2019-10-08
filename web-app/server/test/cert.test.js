process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Cert = require('../models/Cert');
const sinon = require('sinon');
chai.use(chaiHttp);

const app = require('../app');

describe('Route : /cert', () => {
  describe('# GET :/cert/:_id ', () => {
    var findByIdCertStub;
    beforeEach(() => {
      findByIdCertStub = sinon.stub(Cert, 'findById');
    });

    afterEach(() => {
      findByIdCertStub.restore();
    });

    it('should get data success', (done) => {
      findByIdCertStub.yields(undefined, {
        _id: '5d9ac9e4fc93231bc694cb4c',
        name: 'Do Duc Hoang',
        course: 'Blockchain',
        issueDate: 'Mon Oct 07 2019 00:07:17 GMT+0700 (Indochina Time)',
        signature: 'Hoang',
        __v: 0
      });
      chai
        .request(app)
        .get('/cert/5d9ac9e4fc93231bc694cb4c')
        .end((err, res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          done();
        });
    });

    it('should false because not pass validate an ObjectId', (done) => {
      chai
        .request(app)
        .get('/cert/5d9asdsadac')
        .end((err, res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(false);
          done();
        });
    });

    it('should false because not pass validate an ObjectId', (done) => {
      findByIdCertStub.yields(undefined, null);
      chai
        .request(app)
        .get('/cert/5d9ac9e4fc93231bc69eeb4c')
        .end((err, res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(false);
          done();
        });
    });
  });
});
