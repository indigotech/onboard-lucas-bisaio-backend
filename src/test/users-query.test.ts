import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";
import { requestQuery, verifyError } from "./common";

import { User } from "../entity";
import { populateDatabase } from "../seed/populate-db";
import { JWTService } from "../core/security/jwt";
import { UserType } from "../schema";

describe("Tests of Users", async () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;

  before(async () => {
    agent = request(process.env.BASE_URL);
    repository = getRepository(User);
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  afterEach(async () => {
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
  it("should return a list of 10 users", async () => {
    const token = JWTService.sign({ id: 1 });

    const response = await requestQuery(agent, queryUsers, { data: {} }, token);

    const data = response.body.data.users;
    expect(data.users.length).to.be.eq(10);
    expect(data.hasNextPage).to.be.true;
    expect(data.hasPreviousPage).to.be.false;
    expect(data.count).to.be.eq(50);
  });

  it("should return a sorted list of 20 valid users", async () => {
    const token = JWTService.sign({ id: 1 });

    const response = await requestQuery(agent, queryUsers, { data: { take: 20 } }, token);
    const users: UserType[] = response.body.data.users.users;
    expect(users.length).to.be.eq(20);

    const orderByName = users.sort((a, b) => a.name.localeCompare(b.name));
    expect(users).to.be.eq(orderByName);

    users.map((user) => {
      verifyUser(user);
    });
  });

  it("should return a list of 35 first valid users", async () => {
    const token = JWTService.sign({ id: 1 });
    const params = {
      take: 35,
    };

    const response = await requestQuery(agent, queryUsers, { data: params }, token);
    const data = response.body.data.users;
    expect(data.users.length).to.be.eq(params.take);
    expect(data.hasNextPage).to.be.true;
    expect(data.hasPreviousPage).to.be.false;
    expect(data.count).to.be.eq(50);

    data.users.map((user: UserType) => {
      verifyUser(user);
    });
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
    expect(data.count).to.be.eq(50);
  });

  it("should return that dont have next page", async () => {
    const token = JWTService.sign({ id: 1 });
    const params = {
      skip: 40,
      take: 10,
    };

    const response = await requestQuery(agent, queryUsers, { data: params }, token);
    const data = response.body.data.users;
    expect(data.users.length).to.be.eq(10);
    expect(data.hasNextPage).to.be.false;
    expect(data.hasPreviousPage).to.be.true;
    expect(data.count).to.be.eq(50);
  });

  it("should return param skipt is invalid", async () => {
    const token = JWTService.sign({ id: 1 });
    const params = {
      skip: -1,
    };
    const expectedError = {
      message: "Argumento inválido",
      code: 400,
      details: "`skip` should not be negative",
    };

    const response = await requestQuery(agent, queryUsers, { data: params }, token);
    verifyError(response.body.errors[0], expectedError);
  });
  it("should return param take is invalid", async () => {
    const token = JWTService.sign({ id: 1 });

    const params = {
      take: -1,
    };
    const expectedError = {
      message: "Argumento inválido",
      code: 400,
      details: "`take` should be positive not null",
    };

    const response = await requestQuery(agent, queryUsers, { data: params }, token);
    verifyError(response.body.errors[0], expectedError);
  });

  it("should return an empty list of users", async () => {
    const token = JWTService.sign({ id: 1 });

    const params = {
      skip: 50,
    };

    const response = await requestQuery(agent, queryUsers, { data: params }, token);
    expect(response.body.data.users.users.length).to.be.eq(0);
    expect(response.body.data.users.hasNextPage).to.be.false;
    expect(response.body.data.users.hasPreviousPage).to.be.true;
  });

  const verifyUser = (user: UserType) => {
    expect(user.name).to.not.be.empty;
    expect(user.email).to.not.be.empty;
    expect(user.id).to.not.be.empty;
  };
});
