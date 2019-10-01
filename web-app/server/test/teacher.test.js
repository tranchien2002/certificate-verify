process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const User = require('../models/User');
const sinon = require('sinon');

const app = require('../app');

describe('Route /teacher', () => {
    describe('#POST /teacher/create', () => {
        var findOneUserStub;
        var saveUserStub;

        beforeEach(() => {
            findOneUserStub = sinon.stub(User, 'findOne');
            saveUserStub = sinon.stub(User.prototype, 'save');
        });

        afterEach(() => {
            findOneUserStub.restore();
            saveUserStub.restore();
        });

        it('should be invalid if username and name is empty', (done) => {
            request(app)
                .post('/teacher/create')
                .send({
                    username: '',
                    name: ''
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
            	.send({
                	username: 'thienthangaycanh',
                	name: 'thien than gay canh'
            	})
            	.then((res) => {
                	expect(res.status).equal(200);
                	expect(res.body.msg).equal('Create success');
                	done();
            	});
        });

        it('should fail because the username already exists.', (done) => {
            findOneUserStub = sinon.stub(User, 'findOne').yields(undefined, {
                username: 'thienthangaycanh',
                password: '123456',
                name: 'thien than gay canh'
            });

            request(app)
				.post('/teachers/create')
				.send({
					username: 'thienthangaycanh',
					name: 'thien than gay canh'
				})
				.then((res) => {
					expect(res.status).equal(200);
					expect(res.body.msg).equal('Account is exist');
				})
        });
    });
});