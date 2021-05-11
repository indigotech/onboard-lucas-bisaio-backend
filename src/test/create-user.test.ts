import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { getRepository, Repository } from "typeorm";

import { setup } from "../server";
import { User } from "../entity";
import { JWTService } from "../core/security/jwt";
import { CryptoService } from "../core/security/crypto";
import { ErrorMessage } from "../core/error";
import { CreateUserInput, UserType } from "../schema/schema.types";
import { createUserEntity, requestQuery } from "./common";

describe("Test for CreateUser", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;
  const input: CreateUserInput = {
    name: "admin",
    email: "admin@taqtile.com.br",
    password: "1234qwer",
    birthDate: "01-01-2000",
  };

  before(async () => {
    await setup();
    agent = request(`${process.env.BASE_URL}`);
    repository = getRepository(User);
  });

  afterEach(() => {
    repository.delete({});
  });

  const createUser = `
    mutation CreateUser($data: CreateUserInput!) {
      createUser(data: $data) {
        id
        name
        email
        birthDate
      }
    }
  `;

  it("should throw an error saying not logged in", async () => {
    const token = "";
    const response = await requestQuery(agent, createUser, { data: input }, token);
    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.token.invalid);
    expect(response.body.errors[0].code).to.be.eq(401);
    expect(response.body.errors[0].details).to.be.eq("Token not found");
  });

  it("should create a new user", async () => {
    const token = JWTService.sign({ id: 1 });

    input.email = "email_test@taqtile.com";
    const response = await requestQuery(agent, createUser, { data: input }, token);

    const email = input.email;
    const newUser: UserType = response.body.data.createUser;
    expect(+newUser.id).to.be.greaterThan(0);
    expect(newUser.email).to.be.eq(input.email);
    expect(newUser.name).to.be.eq(input.name);
    expect(newUser.birthDate).to.be.eq(input.birthDate);

    const findOne = await repository.findOne({ email });
    expect(findOne?.email).to.be.eq(email);
    expect(findOne?.id).to.be.greaterThan(0);
    expect(findOne?.name).to.be.eq(input.name);
    expect(findOne?.birthDate).to.be.eq(input.birthDate);

    const hashedPassword = CryptoService.encode(input.password);
    expect(findOne?.password).to.be.eq(hashedPassword);
  });

  it("should return a error saying invalid password", async () => {
    const data: CreateUserInput = {
      name: "taqtile",
      email: "taqtiler@taqtile.com.br",
      password: "invalid-password",
    };

    const token = JWTService.sign({ id: 1 });
    const response = await requestQuery(agent, createUser, { data }, token);

    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.badlyFormattedPassword);
    expect(response.body.errors[0].code).to.be.eq(401);
  });

  it("should return a error saying invalid email", async () => {
    const token = JWTService.sign({ id: 1 });

    const newUser: CreateUserInput = {
      name: "new user",
      email: "user@taqtile.com.br",
      password: "1234qwer",
    };
    await createUserEntity(newUser);

    const response = await requestQuery(agent, createUser, { data: newUser }, token);
    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.email);
    expect(response.body.errors[0].code).to.be.eq(401);
  });
});
