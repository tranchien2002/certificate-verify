process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const sinon = require('sinon');
const network = require('../fabric/network');
const test = require('sinon-test')(sinon, { useFakeTimers: false });

const app = require('../app');

describe('Route /teacher', () => {
  describe('#POST /teacher/create', () => {
    let findOneUserStub;
    let saveUserStub;
    let registerTeacherStub;

    beforeEach(() => {
      findOneUserStub = sinon.stub(User, 'findOne');
      saveUserStub = sinon.stub(User.prototype, 'save');
      registerTeacherStub = sinon.stub(network, 'registerTeacherOnBlockchain');
    });

    afterEach(() => {
      findOneUserStub.restore();
      saveUserStub.restore();
      registerTeacherStub.restore();
    });

    it('should be invalid if username and name is empty', (done) => {
      request(app)
        .post('/teacher/create')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkOWQ3MDEzOGUzZTA3NDJkN2Y3MWE5NiIsInVzZXJuYW1lIjoiYWRtaW5hY2FkZW15IiwicGFzc3dvcmQiOiIkMmEkMTAkL0EzMElGVC5yUTNPNWQ3MlNvMU45dWFTSEhpdGp4MWRIYm80ZlYxYnNtdTlzUktmMXl0YW0iLCJyb2xlIjoxLCJfX3YiOjB9LCJpYXQiOjE1NzA1OTg5NzZ9.wgo4M3881WRudU4YTGtThJvUIduisO5YGXPkT940qCQ'
        )
        .send({
          username: '',
          fullname: ''
        })
        .then((res) => {
          expect(res.status).equal(422);
          expect(res.body.errors[0].msg).equal('Invalid value');
          done();
        });
    });

    it('should create success', (done) => {
      findOneUserStub.yields(undefined, null);

      request(app)
        .post('/teacher/create')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkOWQ3MDEzOGUzZTA3NDJkN2Y3MWE5NiIsInVzZXJuYW1lIjoiYWRtaW5hY2FkZW15IiwicGFzc3dvcmQiOiIkMmEkMTAkL0EzMElGVC5yUTNPNWQ3MlNvMU45dWFTSEhpdGp4MWRIYm80ZlYxYnNtdTlzUktmMXl0YW0iLCJyb2xlIjoxLCJfX3YiOjB9LCJpYXQiOjE1NzA1OTg5NzZ9.wgo4M3881WRudU4YTGtThJvUIduisO5YGXPkT940qCQ'
        )
        .send({
          username: 'thienthangaycanh',
          fullname: 'thien than gay canh'
        })
        .then((res) => {
          expect(res.status).equal(200);
          done();
        });
    });

    it('should fail because the username already exists.', (done) => {
      findOneUserStub.yields(undefined, {
        username: 'thienthangaycanh',
        name: 'thien than gay canh'
      });

      request(app)
        .post('/teacher/create')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
        )
        .send({
          username: 'thienthangaycanh',
          fullname: 'thien than gay canh'
        })
        .then((res) => {
          expect(res.status).equal(409);
          done();
        });
    });
  });
  describe('#GET /all', () => {
    var allUserStub;

    beforeEach(() => {
      allUserStub = sinon.stub(User, 'find');
    });

    afterEach(() => {
      allUserStub.restore();
    });

    it('should return all teachers.', (done) => {
      allUserStub.yields(undefined, [
        {
          id: 1,
          username: 'GV01',
          role: USER_ROLES.TEACHER
        },
        {
          id: 2,
          username: 'GV02',
          role: USER_ROLES.TEACHER
        },
        {
          id: 3,
          username: 'GV03',
          role: USER_ROLES.TEACHER
        }
      ]);

      request(app)
        .get('/teacher/all')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkOWQ3MDEzOGUzZTA3NDJkN2Y3MWE5NiIsInVzZXJuYW1lIjoiYWRtaW5hY2FkZW15IiwicGFzc3dvcmQiOiIkMmEkMTAkL0EzMElGVC5yUTNPNWQ3MlNvMU45dWFTSEhpdGp4MWRIYm80ZlYxYnNtdTlzUktmMXl0YW0iLCJyb2xlIjoxLCJfX3YiOjB9LCJpYXQiOjE1NzA1OTg5NzZ9.wgo4M3881WRudU4YTGtThJvUIduisO5YGXPkT940qCQ'
        )
        .then((res) => {
          //console.log(res.body)
          expect(res.body.success).equal(true);
          expect(res.body.teachers.length).eql(3);
          done();
        });
    });
  });
});

describe('#POST /teacher/score', () => {
  let connect;
  let query;

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    query = sinon.stub(network, 'query');

    query.withArgs('QueryStudent', '20156425');
  });

  afterEach(() => {
    connect.restore();
    query.restore();
  });

  it(
    'success create score with role teacher',
    test((done) => {
      connect.returns({ error: null });
      request(app)
        .post('/teacher/score')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoyfSwiaWF0IjoxNTcwNDMxNDM2fQ.UHMvFI3zHDFncCr6ZodNjSZsPhji3ut2Z583iYLa6fs'
        )
        .send({
          subjectid: '02',
          studentusername: 'tan',
          score: 9.5
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  );

  it(
    'do not success create score with req.body.score is not Float',
    test((done) => {
      connect.returns({ error: null });
      request(app)
        .post('/teacher/score')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoyfSwiaWF0IjoxNTcwNDMxNDM2fQ.UHMvFI3zHDFncCr6ZodNjSZsPhji3ut2Z583iYLa6fs'
        )
        .send({
          subjectid: '02',
          studentusername: 'tan',
          score: '<script>alert("hacked");</script>'
        })
        .expect(422)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  );

  it(
    'do not success create score with req.body is empty',
    test((done) => {
      connect.returns({ error: null });
      request(app)
        .post('/teacher/score')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoyfSwiaWF0IjoxNTcwNDMxNDM2fQ.UHMvFI3zHDFncCr6ZodNjSZsPhji3ut2Z583iYLa6fs'
        )
        .send({
          subjectid: '02',
          studentusername: '',
          score: ''
        })
        .expect(422)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  );

  it(
    'do not success create score with role admin academy',
    test((done) => {
      connect.returns({ error: null });
      request(app)
        .post('/teacher/score')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
        )
        .send({
          subjectid: '02',
          studentusername: 'tan',
          score: 10
        })
        .expect(403)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  );

  it(
    'do not success create score with role student',
    test((done) => {
      connect.returns({ error: null });
      request(app)
        .post('/teacher/score')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjozfSwiaWF0IjoxNTcwNDMxNjA0fQ.z_wj2Vbj6O7sw4n9Jk6QpcUUHnAnYXULScCZSe7c5Zg'
        )
        .send({
          subjectid: '02',
          studentusername: 'tantv',
          score: 10.0
        })
        .expect(403)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  );
});
