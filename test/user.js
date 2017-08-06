import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../config';
import db from '../components/db';
import users from '../fixtures/users';

chai.use(chaiHttp);
const should = chai.should();
let token;

describe('Users', () => {

  before((done) => {
    db.users.remove({})
    .then(() => db.users.create(users.list))
    .then(() => done());
  });

  it('it should POST new user', (done) => {
    chai.request(config.host)
    .post('/user')
    .set('Content-Type', "application/json")
    .send(users.new)
    .end((error, result) => {
      result.body.should.be.a('object');
      result.body.should.have.property('status');
      result.body.status.should.to.be.true;
      done();
    });
  });

  it('it should NOT login on POST wrong email and password', (done) => {
    chai.request(config.host)
    .post('/user/login')
    .set('Content-Type', "application/json")
    .send({email: "fake", password: "password"})
    .end((error, result) => {
      result.body.should.be.a('object');
      result.body.should.have.property('status');
      result.body.status.should.to.be.false;
      result.body.should.have.property('error');
      done();
    });
  });

  it('it should login on POST proper email and password', (done) => {
    chai.request(config.host)
    .post('/user/login')
    .set('Content-Type', "application/json")
    .send({email: users.new.email, password: users.new.password})
    .end((error, result) => {
      result.body.should.be.a('object');
      result.body.should.have.property('status');
      result.body.status.should.to.be.true;
      result.body.should.have.property('token');
      token = result.body.token;
      done();
    });
  });

  it('it should GET user', (done) => {
    chai.request(config.host)
    .get('/me')
    .set('X-Access-Token', token)
    .set('Content-Type', "application/json")
    .end((error, result) => {
      result.body.should.be.a('object');
      result.body.should.have.property('status');
      result.body.status.should.to.be.true;
      result.body.should.have.property('user');
      done();
    });
  });

  it('it should GET all users', (done) => {
    chai.request(config.host)
    .get('/users')
    .set('X-Access-Token', token)
    .set('Content-Type', "application/json")
    .end((error, result) => {
      result.body.should.be.a('object');
      result.body.should.have.property('users');
      result.body.users.should.be.a('array');
      result.body.users.length.should.be.eql(3);
      done();
    });
  });

  after((done) => {
    db.users.remove({}).then(() => done());
  });

});