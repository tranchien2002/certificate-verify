process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const sinon = require('sinon');
const User = require('../models/User');
const network = require('../fabric/network');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const test = require('sinon-test')(sinon, { useFakeTimers: false });

const app = require('../app');

require('dotenv').config();

describe('GET /account/me', () => {
  let connect;
  let query;
  let findOneUserStub;

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    query = sinon.stub(network, 'query');
    findOneUserStub = sinon.stub(User, 'findOne');
  });

  afterEach(() => {
    connect.restore();
    query.restore();
    findOneUserStub.restore();
  });

  it(
    'failed connect to blockchain',
    test((done) => {
      connect.returns(null);
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.STUDENT
      });
      request(app)
        .get('/account/me')
        .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(false);
          expect(res.body.msg).equal('Failed connect to blockchain');
          done();
        });
    })
  );

  it(
    'failed to query info student in chaincode',
    test((done) => {
      connect.returns({
        contract: 'academy',
        network: 'certificatechannel',
        gateway: 'gateway',
        user: { username: 'hoangdd', role: USER_ROLES.TEACHER }
      });

      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.TEACHER
      });

      query.returns({ success: false, msg: 'Error' });

      request(app)
        .get('/account/me')
        .set('authorization', `${process.env.JWT_TEACHER_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(false);
          expect(res.body.msg).equal('Error');
          done();
        });
    })
  );

  it(
    'success query info of user student',
    test((done) => {
      query.withArgs('QueryStudent');
      connect.returns({ error: null });
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.STUDENT
      });
      query.returns({
        success: true,
        msg: {
          Username: 'hoangdd',
          Fullname: 'Do Hoang',
          Subjects: ['1', '2']
        }
      });
      request(app)
        .get('/account/me')
        .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          done();
        });
    })
  );

  it(
    'success query info of user teacher',
    test((done) => {
      query.withArgs('QueryTeacher');
      connect.returns({ error: null });
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.TEACHER
      });
      query.returns({
        success: true,
        msg: {
          Username: 'hoangdd',
          Fullname: 'Do Hoang',
          Subjects: ['1', '2']
        }
      });
      request(app)
        .get('/account/me')
        .set('authorization', `${process.env.JWT_TEACHER_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          done();
        });
    })
  );

  it(
    'success query info of admin academy',
    test((done) => {
      connect.returns({ error: null });
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.ADMIN_ACADEMY
      });
      request(app)
        .get('/account/me')
        .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          expect(res.body.username).equal('hoangdd');
          expect(res.body.role).equal(1);
          done();
        });
    })
  );

  it(
    'success query info of admin student',
    test((done) => {
      connect.returns({ error: null });
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.ADMIN_STUDENT
      });
      request(app)
        .get('/account/me')
        .set('authorization', `${process.env.JWT_ADMIN_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          expect(res.body.username).equal('hoangdd');
          expect(res.body.role).equal(3);
          done();
        });
    })
  );
});

describe('GET /account/me/subject', () => {
  let connect;
  let queryUserSubjectsStub;
  let findOneUserStub;

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    queryUserSubjectsStub = sinon.stub(network, 'queryUserSubjects');
    findOneUserStub = sinon.stub(User, 'findOne');
  });

  afterEach(() => {
    connect.restore();
    queryUserSubjectsStub.restore();
    findOneUserStub.restore();
  });

  it(
    'failed connect to blockchain',
    test((done) => {
      connect.returns(null);
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.STUDENT
      });
      request(app)
        .get('/account/me/subject')
        .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(false);
          expect(res.body.msg).equal('Failed connect to blockchain');
          done();
        });
    })
  );

  it(
    'failed to query subject of user student in chaincode',
    test((done) => {
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.STUDENT
      });

      connect.returns({
        contract: 'academy',
        network: 'certificatechannel',
        gateway: 'gateway',
        user: { username: 'hoangdd', role: USER_ROLES.STUDENT }
      });

      queryUserSubjectsStub.returns({ success: false, msg: 'Error' });

      request(app)
        .get('/account/me/subject')
        .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(false);
          expect(res.body.msg).equal('Error');
          done();
        });
    })
  );

  it(
    'success query subjects of user student',
    test((done) => {
      connect.returns({
        contract: 'academy',
        network: 'certificatechannel',
        gateway: 'gateway',
        user: { username: 'hoangdd', role: USER_ROLES.STUDENT }
      });
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.STUDENT
      });
      queryUserSubjectsStub.returns({
        success: true,
        msg: {
          SubjectID: 'INT2002',
          Name: 'C++',
          TeacherUsername: 'tanbongcuoi',
          Students: ['1', '2']
        }
      });
      request(app)
        .get('/account/me/subject')
        .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          done();
        });
    })
  );

  it(
    'success query subjects of user teacher',
    test((done) => {
      connect.returns({
        contract: 'academy',
        network: 'certificatechannel',
        gateway: 'gateway',
        user: { username: 'hoangdd', role: USER_ROLES.TEACHER }
      });
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.TEACHER
      });
      queryUserSubjectsStub.returns({
        success: true,
        msg: {
          SubjectID: 'INT2002',
          Name: 'C++',
          TeacherUsername: 'tanbongcuoi',
          Students: ['1', '2']
        }
      });
      request(app)
        .get('/account/me/subject')
        .set('authorization', `${process.env.JWT_TEACHER_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          done();
        });
    })
  );

  it(
    'success query subjects of user admin student',
    test((done) => {
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.ADMIN_STUDENT
      });
      request(app)
        .get('/account/me/subject')
        .set('authorization', `${process.env.JWT_ADMIN_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          expect(res.body.msg).equal('You do not have subject');
          done();
        });
    })
  );

  it(
    'success query subjects of user admin academy',
    test((done) => {
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.ADMIN_ACADEMY
      });
      request(app)
        .get('/account/me/subject')
        .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          expect(res.body.msg).equal('You do not have subject');
          done();
        });
    })
  );
});

describe('GET /account/me/certificate', () => {
  let connect;
  let query;
  let findOneUserStub;

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    query = sinon.stub(network, 'query');
    findOneUserStub = sinon.stub(User, 'findOne');
    query.withArgs('GetMyCerts');
  });

  afterEach(() => {
    connect.restore();
    query.restore();
    findOneUserStub.restore();
  });

  it(
    'success query certificates of user student',
    test((done) => {
      connect.returns({
        contract: 'academy',
        network: 'certificatechannel',
        gateway: 'gateway',
        user: { username: 'hoangdd', role: USER_ROLES.STUDENT }
      });

      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.STUDENT
      });

      query.returns({
        success: true,
        msg: {
          CertificateID: 'A354',
          SubjectID: 'INT-2019',
          StudentUsername: 'tanbongcuoi',
          IssueDate: '10-10-2019'
        }
      });
      request(app)
        .get('/account/me/certificate')
        .set('authorization', `${process.env.JWT_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          done();
        });
    })
  );

  it(
    'alert are not student when user teacher query',
    test((done) => {
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.TEACHER
      });

      request(app)
        .get('/account/me/certificate')
        .set('authorization', `${process.env.JWT_TEACHER_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          expect(res.body.msg).equal('You are not student');
          done();
        });
    })
  );

  it(
    'alert are not student when user admin student',
    test((done) => {
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.ADMIN_STUDENT
      });
      request(app)
        .get('/account/me/certificate')
        .set('authorization', `${process.env.JWT_ADMIN_STUDENT_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          expect(res.body.msg).equal('You are not student');
          done();
        });
    })
  );

  it(
    'alert are not student when user admin academy',
    test((done) => {
      findOneUserStub.yields(undefined, {
        username: 'hoangdd',
        role: USER_ROLES.ADMIN_ACADEMY
      });
      request(app)
        .get('/account/me/certificate')
        .set('authorization', `${process.env.JWT_ADMIN_ACADEMY_EXAMPLE}`)
        .then((res) => {
          expect(res.status).equal(200);
          expect(res.body.success).equal(true);
          expect(res.body.msg).equal('You are not student');
          done();
        });
    })
  );
});
