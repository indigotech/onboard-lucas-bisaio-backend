import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";
import { requestQuery } from "./common";

import { User } from "../entity";
import { populateDatabase } from "../seed/populate-db";
import { JWTService } from "../core/security/jwt";

describe("Tests of Users", async () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;

  before(async () => {
    agent = request(`${process.env.BASE_URL}`);
    repository = getRepository(User);
    await populateDatabase();
  });

  after(async () => {
    await repository.delete({});
  });

  const queryUsers = `
    query Users($data: UsersInput!) {
      users(data: $data) {
        hasNextPage
        hasPreviousPage
        count
        users {
          name
          id
          email
          birthDate
        }
      }
    }
  `;
  it("should return a list of 10 first users", async () => {
    const token = JWTService.sign({ id: 1 });

    const response = await requestQuery(agent, queryUsers, { data: {} }, token);

    const data = response.body.data.users;
    expect(data.users.length).to.be.eq(10);
    expect(data.hasNextPage).to.be.true;
    expect(data.hasPreviousPage).to.be.false;
    expect(+data.count).to.be.eq(50);
  });

  it("should return a list of 35 first users", async () => {
    const token = JWTService.sign({ id: 1 });
    const params = {
      take: 35,
    };

    const response = await requestQuery(agent, queryUsers, { data: params }, token);
    const data = response.body.data.users;
    expect(data.users.length).to.be.eq(params.take);
    expect(data.hasNextPage).to.be.true;
    expect(data.hasPreviousPage).to.be.false;
    expect(+data.count).to.be.eq(50);
  });

  it("should return the last 10 users", async () => {
    const token = JWTService.sign({ id: 1 });
    const params = {
      skip: 40,
    };

    const response = await requestQuery(agent, queryUsers, { data: params }, token);
    const data = response.body.data.users;
    expect(data.users.length).to.be.eq(10);
    expect(data.hasNextPage).to.be.false;
    expect(data.hasPreviousPage).to.be.true;
    expect(+data.count).to.be.eq(50);
  });
});
