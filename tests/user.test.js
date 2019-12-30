const userModel = require('./../src/models/user.model');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../src/server');
const should = chai.should();

chai.use(chaiHttp);

describe('User Controller', () => {
  beforeEach((done) => {
    userModel.deleteOne({ 'email': 'tester@email.com' },
      () => {
        done();
      });
  });

  describe('/POST user', () => {
    it('it should not create a user without email address', (done) => {
      const user = {
        name: "user",
        password: "pass"
      }
      chai.request(server)
        .post('/sign-up')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.eql('Invalid data');
          done();
        });
    });

    it('it should create a user ', (done) => {
      const user = {
        name: "me",
        email: "tester@email.com",
        password: "pass"
      }
      chai.request(server)
        .post('/sign-up')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('token');
          done();
        });
    });
  });
});