import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";

import { User } from "../entity";
import { JWTService } from "../core/security/jwt";
import { CreateUserInput } from "../schema/schema.types";
import { createUserEntity, requestQuery } from "./common";

describe("Test for Login", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;
  const input: CreateUserInput = {
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

  it("should verify the token", async () => {
    const validToken = JWTService.sign({ id: 1 });
    expect(JWTService.verify(validToken)).to.be.true;

    const decoded = JWTService.decode(validToken);
    expect(decoded.data).to.be.eq(1);
    expect(+decoded.exp - +decoded.iat).to.be.eq(+process.env.TOKEN_TIMEOUT!);

    const rememberMeToken = JWTService.sign({ id: 1, rememberMe: true });
    expect(JWTService.verify(rememberMeToken)).to.be.true;

    const rememberMeDecoded = JWTService.decode(rememberMeToken);
    expect(rememberMeDecoded.data).to.be.eq(1);
    const secondsInWeek = 3600 * 24 * 7;
    expect(+rememberMeDecoded.exp - +rememberMeDecoded.iat).to.be.eq(new Date(secondsInWeek).getTime());
  });

  it("should not find email in login", async () => {
    const data = {
      email: "unknown.user@test.com",
      password: "1234qwer",
    };

    const response = await requestQuery(agent, login, { data });
    expect(response.body.errors[0].message).to.be.eq("Usuário não encontrado");
    expect(response.body.errors[0].code).to.be.eq(404);
    expect(response.body.errors[0].details).to.be.eq("User not found");
  });

  it("should say invalid password", async () => {
    await createUserEntity(input);

    const data = {
      email: input.email,
      password: "incorrect-password123",
    };

    const response = await requestQuery(agent, login, { data });
    expect(response.body.errors[0].message).to.be.eq("Credenciais inválidas. Tente novamente.");
    expect(response.body.errors[0].code).to.be.eq(401);
    expect(response.body.errors[0].details).to.be.eq("Unauthorized");
  });
});
