import { expect } from "chai";
import request from "supertest";

describe("Tests for Hello", () => {
  it("should return a hello world", async () => {
    const agent = request(`${process.env.BASE_URL}${process.env.SERVER_PORT}`);
    const query = "{ hello }";
    const response = await agent.post("/graphql").set("Accept", "application/json").send({ query });

    expect(response.body.data.hello).to.be.eq("Hello World!");
  });
});
