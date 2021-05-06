const { expect } = require('chai');
const request = require('supertest');

describe('Query - Hello - GraphQL', () => {
  let agent;

  before('Init Server', () => { 
    agent = request("http://localhost:4000").post("/graphql");
    agent.set("Accept", "application/json");
  });

  it('Hello World Query', (done) => {
    const query = '{ hello }';
    agent
      .send({ query })
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        expect(res.body.data.hello).to.be.eq('Hello World!');
        return done();
      });
  });
})