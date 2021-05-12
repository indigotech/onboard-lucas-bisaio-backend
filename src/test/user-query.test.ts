import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { getRepository, Repository } from "typeorm";

import { User } from "../entity";
import { ErrorMessage } from "../core/error";
import { JWTService } from "../core/security/jwt";
import { CreateUserInput } from "../schema/schema.types";
import { createUserEntity, requestQuery, verifyError } from "./common";

describe("Tests for User", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;

  const user: CreateUserInput = {
    name: "user",
    email: "user@taqtile.com",
    password: "1234qwer",
    birthDate: "01-01-2000",
  };

  before(async () => {
    agent = request(`${process.env.BASE_URL}`);
    repository = getRepository(User);
  });

  afterEach(() => {
    repository.delete({});
  });

  const userQuery = `
    query User($data: UserInput!) {
      user(data: $data) {
        id
        name
        email
        birthDate
      }
    }
  `;
  it("should return an user", async () => {
    const savedUser = await createUserEntity(user);
    // const savedUser = await getRepository(User).findOne({ email: user.email });
    const id = savedUser?.id!;
    const token = JWTService.sign({ id });

    const response = await requestQuery(agent, userQuery, { data: { id } }, token);
    expect(response.body.data.user.name).to.be.eq(user.name);
    expect(response.body.data.user.email).to.be.eq(user.email);
    expect(response.body.data.user.birthDate).to.be.eq(user.birthDate);
    expect(+response.body.data.user.id).to.be.eq(id);
  });

  it("should return an error - invalid id", async () => {
    const id = -1;
    const token = JWTService.sign({ id });

    const response = await requestQuery(agent, userQuery, { data: { id } }, token);
    const expectedError = {
      message: "Usuário não encontrado",
      code: 404,
      details: "User not found",
    };
    verifyError(response.body.errors[0], expectedError);
  });

  it("should return an error - invalid token", async () => {
    const savedUser = await createUserEntity(user);
    // const savedUser = await getRepository(User).findOne({ email: user.email });
    const id = savedUser?.id!;
    const invalidToken = "invalid-token";

    const response = await requestQuery(agent, userQuery, { data: { id } }, invalidToken);
    const expectedError = {
      message: ErrorMessage.token.invalid,
      code: 401,
      details: "Unauthorized",
    };

    verifyError(response.body.errors[0], expectedError);
  });
});
