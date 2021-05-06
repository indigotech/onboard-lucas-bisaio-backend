import request, { Test } from "supertest";
import { expect } from "chai";
import { setup } from "../server";

describe("Query - Hello - GraphQL", () => {
  let agent: Test;

  before(async () => {
    await setup();
    agent = request(`${process.env.BASE_URL}${process.env.SERVER_PORT}`).post(
      "/graphql"
    );
    agent.set("Accept", "application/json");
  });

  it("should return a hello world", async () => {
    const query = "{ hello }";
    const response = await agent.send({ query });
    expect(response.body.data.hello).to.be.eq("Hello World!");
  });
});
