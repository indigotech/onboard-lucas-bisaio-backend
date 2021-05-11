import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { getRepository, Repository } from "typeorm";

import { User } from "../entity";

describe("Tests for Hello", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;

  before(async () => {
    agent = request(`${process.env.BASE_URL}${process.env.SERVER_PORT}`);
    repository = getRepository(User);
  });

  afterEach(() => {
    repository.delete({});
  });

  it("should return a hello world", async () => {
    const query = "{ hello }";
    const response = await requestQuery(query);
    expect(response.body.data.hello).to.be.eq("Hello World!");
  });

  const requestQuery = (query: string, variables?: any): Test => {
    return agent.post("/graphql").set("Accept", "application/json").send({
      query,
      variables,
    });
  };
});
