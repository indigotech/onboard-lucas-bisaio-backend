import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";

import { User } from "../entity";

describe("Tests of Users", async () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;

  before(() => {
    agent = request(`${process.env.BASE_URL}`);
    repository = getRepository(User);
  });

  it("should return a list of 20 users", async () => {});
});
