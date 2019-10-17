process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const sinon = require('sinon');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const network = require('../fabric/network');
const test = require('sinon-test')(sinon, { useFakeTimers: false });

const app = require('../app');

require('dotenv').config();

describe('GET /account/student', () => {
  describe('GET /account/student/all', () => {
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
      'do not success query all student with admin student',
      test((done) => {
        request(app)
          .get('/account/student/all')
          .set('authorization', `${process.env.JWT_ADMIN_STUDENT_EXAMPLE}`)
          .then((res) => {
            expect(res.body.success).equal(false);
            expect(res.body.msg).equal('Permission Denied');
            done();
          });
      })
    );

    it(
      'success query all student with admin academy',
      test((done) => {
        connect.returns({ error: null });
        let data = JSON.stringify({ username: 'tantv' }, { username: 'nghianv' });

        query.returns({
          success: true,
          msg: data
        });
        request(app)
          .get('/account/student/all')
          .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
          .then((res) => {
            expect(res.status).equal(200);
            expect(res.body.success).equal(true);
            done();
          });
      })
    );

    it(
      'do not success query all student with teacher',
      test((done) => {
        request(app)
          .get('/account/student/all')
          .set('authorization', `${process.env.JWT_TEACHER_EXAMPLE}`)
          .then((res) => {
            expect(res.body.success).equal(false);
            expect(res.body.msg).equal('Permission Denied');
            done();
          });
      })
    );

    it(
      'do not success query all student with student',
      test((done) => {
        request(app)
          .get('/account/student/all')
          .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
          .then((res) => {
            expect(res.body.success).equal(false);
            expect(res.body.msg).equal('Permission Denied');
            done();
          });
      })
    );
  });
});
