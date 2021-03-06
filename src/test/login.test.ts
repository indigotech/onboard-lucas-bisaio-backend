import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";

import { User } from "../entity";
import { JWTService } from "../core/security/jwt";
import { CreateUserInput } from "../schema/schema.types";
import { createUserEntity, requestQuery, verifyError } from "./common";

describe("Tests for Login", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;
  const input: CreateUserInput = {
    name: "admin",
    email: "admin@taqtile.com.br",
    password: "1234qwer",
    birthDate: "01-01-2000",
  };

  before(() => {
    agent = request(process.env.BASE_URL);
    repository = getRepository(User);
  });

  afterEach(async () => {
    await repository.delete({});
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

  it("should verify the token without remember me", async () => {
    await createUserEntity(input);
    const currentUser = await getRepository(User).findOne({ email: input.email });
    const data = {
      email: input.email,
      password: input.password,
    };

    const response = await requestQuery(agent, login, { data });
    const validToken: string = response.body.data.login.token;
    expect(JWTService.verify(validToken)).to.be.true;

    const decoded = JWTService.decode(validToken);
    expect(decoded.data).to.be.eq(currentUser?.id);
    expect(+decoded.exp - +decoded.iat).to.be.eq(+process.env.TOKEN_TIMEOUT!);
  });
  it("should verify the token with remember me", async () => {
    await createUserEntity(input);
    const currentUser = await getRepository(User).findOne({ email: input.email });
    const data = {
      email: input.email,
      password: input.password,
      rememberMe: true,
    };

    const response = await requestQuery(agent, login, { data });
    const rememberMeToken: string = response.body.data.login.token;
    expect(JWTService.verify(rememberMeToken)).to.be.true;

    const secondsInWeek = 3600 * 24 * 7;
    const rememberMeDecoded = JWTService.decode(rememberMeToken);
    expect(rememberMeDecoded.data).to.be.eq(currentUser?.id);
    expect(+rememberMeDecoded.exp - +rememberMeDecoded.iat).to.be.eq(new Date(secondsInWeek).getTime());
  });

  it("should not find email in login", async () => {
    const data = {
      email: "unknown.user@test.com",
      password: "1234qwer",
    };

    const response = await requestQuery(agent, login, { data });
    const expectedError = {
      message: "Usu??rio n??o encontrado",
      code: 404,
      details: "User not found",
    };
    verifyError(response.body.errors[0], expectedError);
  });

  it("should return an error - invalid password", async () => {
    await createUserEntity(input);

    const data = {
      email: input.email,
      password: "incorrect-password123",
    };

    const response = await requestQuery(agent, login, { data });
    const expectedError = {
      message: "Credenciais inv??lidas. Tente novamente.",
      code: 401,
      details: "Unauthorized",
    };
    verifyError(response.body.errors[0], expectedError);
  });
});
