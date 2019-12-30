const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../src/server');
const should = chai.should();

chai.use(chaiHttp);

describe('Project Controller', () => {
  describe('/GET projects', () => {
    it('it should block unauthorized users', (done) => {
      chai.request(server)
        .get('/project')
        .end((err, res) => {
          res.should.have.status(401);
          res.text.should.be.eql('Access denied');
          done();
        });
    });
  });
});