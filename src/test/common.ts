import { getRepository } from "typeorm";
import { Test, SuperTest } from "supertest";
import { expect } from "chai";

import { CryptoService } from "../core/security/crypto";
import { User, Address } from "../entity";
import { CreateUserInput, AddressInput } from "../schema/schema.types";

export const createUserEntity = async (data: CreateUserInput): Promise<User> => {
  const user = new User();
  user.email = data.email;
  user.name = data.name;
  user.password = CryptoService.encode(data.password);
  user.birthDate = data.birthDate;

  return getRepository(User).save(user);
};

export const requestQuery = (agent: SuperTest<Test>, query: string, variables?: any, token?: string): Test => {
  return agent
    .post("/graphql")
    .set("Accept", "application/json")
    .set("Authorization", token ?? "")
    .send({
      query,
      variables,
    });
};

interface VerifyErrorParams {
  message: string;
  code: number;
  details?: string;
}

export const verifyError = (received: VerifyErrorParams, expected: VerifyErrorParams) => {
  expect(received.message).to.be.eq(expected.message);
  expect(received.code).to.be.eq(expected.code);
  expect(received.details).to.be.eq(expected.details);
};

export const createAddressAndSave = async (address: AddressInput): Promise<Address> => {
  const userAddress = new Address();
  userAddress.state = address.state;
  userAddress.city = address.city;
  userAddress.neighborhood = address.neighborhood;
  userAddress.street = address.street;
  userAddress.number = address.number;

  return await getRepository(Address).save(userAddress);
};
