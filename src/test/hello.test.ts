import { expect } from "chai";
import request, { Test } from "supertest";

describe("Query - Hello - GraphQL", () => {
  let agent: Test;

  before("Init Server", () => {
    agent = request("http://localhost:4000").post("/graphql");
    agent.set("Accept", "application/json");
  });

  it("Hello World Query", async () => {
    const query = "{ hello }";
    const response = await agent.send({ query });
    expect(response.body.data.hello).to.be.eq("Hello World!");
  });
});
