import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";

import { User } from "../entity";
import { UserInput } from "../schema/schema.types";
import { createUserEntity, requestQuery } from "./common";

describe("Test for Login", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;
  const input: UserInput = {
    name: "admin",
    email: "admin@taqtile.com.br",
    password: "1234qwer",
    birthDate: "01-01-2000",
  };

  before(() => {
    agent = request(`${process.env.BASE_URL}`);
    repository = getRepository(User);
  });

  afterEach(() => {
    repository.delete({});
  });

  const login = `
    mutation Login($data: LoginInput!) {
      login(data: $data) {
        token
        user {
          id
          email
          name
          birthDate
        }
      }
    }
  `;

  it("should login successfully", async () => {
    await createUserEntity(input);

    const data = {
      email: input.email,
      password: input.password,
    };

    const response = await requestQuery(agent, login, { data });
    expect(response.body.data.login.token.indexOf("Bearer ")).to.be.greaterThan(-1);
    expect(response.body.data.login.user.email).to.be.eq(input.email);
    expect(response.body.data.login.user.name).to.be.eq(input.name);
    expect(response.body.data.login.user.birthDate).to.be.eq(input.birthDate);
    expect(+response.body.data.login.user.id).to.be.greaterThan(0);
  });
});
