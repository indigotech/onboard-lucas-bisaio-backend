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
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        console.log("response:", res.body)
        return done();
      });
  });
})