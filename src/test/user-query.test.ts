import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { getRepository, Repository } from "typeorm";

import { User } from "../entity";
import { ErrorMessage } from "../core/error";
import { JWTService } from "../core/security/jwt";
import { CreateUserInput, AddressInput, UserType } from "../schema/schema.types";
import { createUserEntity, createAddressAndSave, requestQuery, verifyError } from "./common";

describe("Tests for User", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;

  const input: CreateUserInput = {
    name: "user",
    email: "user@taqtile.com",
    password: "1234qwer",
    birthDate: "01-01-2000",
  };

  const fakeAddress1: AddressInput = {
    state: "Florida",
    city: "Tallahassee",
    neighborhood: "Leon",
    street: "American Drive",
    number: 3946,
  };

  const fakeAddress2: AddressInput = {
    state: "Indiana",
    city: "South Bend",
    neighborhood: "Saint Joseph",
    street: "Sand Fork Road",
    number: 4215,
  };

  before(async () => {
    agent = request(process.env.BASE_URL);
    repository = getRepository(User);
  });

  afterEach(async () => {
    await repository.delete({});
  });

  const userQuery = `
    query User($data: UserInput!) {
      user(data: $data) {
        id
        name
        email
        birthDate
        address {
          state
          city
          neighborhood
          street
          number
        }
      }
    }
  `;
  it("should return an user", async () => {
    const savedUser = await createUserEntity(input);
    const id = savedUser.id!;
    const token = JWTService.sign({ id });

    const response = await requestQuery(agent, userQuery, { data: { id } }, token);
    expect(response.body.data.user.name).to.be.eq(input.name);
    expect(response.body.data.user.email).to.be.eq(input.email);
    expect(response.body.data.user.birthDate).to.be.eq(input.birthDate);
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
    const savedUser = await createUserEntity(input);
    const id = savedUser.id!;
    const invalidToken = "invalid-token";

    const response = await requestQuery(agent, userQuery, { data: { id } }, invalidToken);
    const expectedError = {
      message: ErrorMessage.token.invalid,
      code: 401,
      details: "Unauthorized",
    };

    verifyError(response.body.errors[0], expectedError);
  });

  it("should return two valid addresses", async () => {
    const address1 = await createAddressAndSave(fakeAddress1);
    const address2 = await createAddressAndSave(fakeAddress2);
    const savedUser = await createUserEntity(input);
    const id = savedUser.id!;
    const token = JWTService.sign({ id });

    savedUser.address = [address1, address2];
    await getRepository(User).save(savedUser);

    const response = await requestQuery(agent, userQuery, { data: { id } }, token);
    const user: UserType = response.body.data.user;

    expect(user.name).to.be.eq(input.name);
    expect(user.email).to.be.eq(input.email);
    expect(user.birthDate).to.be.eq(input.birthDate);
    expect(+user.id).to.be.eq(id);
    expect(user.address.length).to.be.eq(2);
    verifyAddress(user.address[0], fakeAddress1);
    verifyAddress(user.address[1], fakeAddress2);
  });

  const verifyAddress = (received: AddressInput, expected: AddressInput) => {
    expect(received.state).to.be.eq(expected.state);
    expect(received.city).to.be.eq(expected.city);
    expect(received.neighborhood).to.be.eq(expected.neighborhood);
    expect(received.street).to.be.eq(expected.street);
    expect(received.number).to.be.eq(expected.number);
  };
});
