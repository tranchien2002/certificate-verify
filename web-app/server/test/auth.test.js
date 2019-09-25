process.env.NODE_ENV = 'test';

const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Authentication', function() {
  it('should send hello', function(done) {
    chai
      .request(app)
      .get('/auth/')
      .end((err, res) => {
        expect(res.status).equal(200);
        expect(res.body.hello).equal('auth');
        done();
      });
  });
});
