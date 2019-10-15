process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const sinon = require('sinon');
const network = require('../fabric/network');
const test = require('sinon-test')(sinon, { useFakeTimers: false });

const app = require('../app');
require('dotenv').config();

describe('Route /account/teacher', () => {
  describe('#GET /all', () => {
    let connect;
    let query;

    beforeEach(() => {
      connect = sinon.stub(network, 'connectToNetwork');
      query = sinon.stub(network, 'query');
    });

    afterEach(() => {
      connect.restore();
      query.restore();
    });

    it(
      'should return all teachers.',
      test((done) => {
        let data = JSON.stringify(
          { username: 'tantv', fullname: 'Tan Trinh' },
          { username: 'nghianv', fullname: 'Nghia Ngo' },
          { username: 'thienthangaycanh', fullname: 'Tan Trinh' }
        );

        query.returns({
          success: true,
          msg: data
        });

        request(app)
          .get('/account/teacher/all')
          .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
          .then((res) => {
            expect(res.status).equal(200);
            expect(res.body.success).equal(true);
            done();
          });
      })
    );

    it(
      'fail return all teachers.',
      test((done) => {
        query.returns({
          success: false,
          msg: 'Error query chaincode'
        });

        request(app)
          .get('/account/teacher/all')
          .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
          .then((res) => {
            expect(res.body.success).equal(false);
            done();
          });
      })
    );

    it(
      'do not success query all teachers with role teacher',
      test((done) => {
        query.returns({
          success: false,
          msg: 'Error query chaincode'
        });

        request(app)
          .get('/account/teacher/all')
          .set('authorization', `${process.env.JWT_TEACHER_EXAMPLE}`)
          .then((res) => {
            expect(res.body.success).equal(false);
            expect(res.body.msg).equal('Permission Denied');
            done();
          });
      })
    );

    it(
      'do not success query all teachers with role student',
      test((done) => {
        query.returns({
          success: false,
          msg: 'Error query chaincode'
        });

        request(app)
          .get('/account/teacher/all')
          .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
          .then((res) => {
            expect(res.body.success).equal(false);
            expect(res.body.msg).equal('Permission Denied');
            done();
          });
      })
    );

    it(
      'do not success query all teachers with role admin student',
      test((done) => {
        query.returns({
          success: false,
          msg: 'Error query chaincode'
        });

        request(app)
          .get('/account/teacher/all')
          .set('authorization', `${process.env.JWT_ADMIN_STUDENT_EXAMPLE}`)
          .then((res) => {
            expect(res.body.success).equal(false);
            expect(res.body.msg).equal('Permission Denied');
            done();
          });
      })
    );
  });

  describe('#POST /account/teacher/create', () => {
    let findOneUserStub;
    let query;
    let registerTeacherStub;
    let connect;

    beforeEach(() => {
      connect = sinon.stub(network, 'connectToNetwork');
      findOneUserStub = sinon.stub(User, 'findOne');
      query = sinon.stub(network, 'query');
      registerTeacherStub = sinon.stub(network, 'registerTeacherOnBlockchain');
    });

    afterEach(() => {
      connect.restore();
      findOneUserStub.restore();
      query.restore();
      registerTeacherStub.restore();
    });

    it(
      'should fail because the username already exists.',
      test((done) => {
        findOneUserStub.yields(undefined, {
          username: 'thienthangaycanh',
          fullname: 'Tan Trinh'
        });

        request(app)
          .post('/account/teacher/create')
          .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
          .send({
            username: 'thienthangaycanh',
            fullname: 'Tan Trinh'
          })
          .then((res) => {
            expect(res.body.success).equal(false);
            expect(res.body.msg).equal('Teacher username is exist');

            done();
          });
      })
    );
  });
});
