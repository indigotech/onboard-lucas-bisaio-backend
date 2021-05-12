import { getRepository } from "typeorm";
import { Test, SuperTest } from "supertest";
import { expect } from "chai";

import { CryptoService } from "../core/security/crypto";
import { User } from "../entity";
import { CreateUserInput, UserType } from "../schema/schema.types";

export const createUserEntity = async (data: CreateUserInput): Promise<UserType> => {
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

export const verifyError = (sended: VerifyErrorParams, expected: VerifyErrorParams) => {
  expect(sended.message).to.be.eq(expected.message);
  expect(sended.code).to.be.eq(expected.code);
  expect(sended.details).to.be.eq(expected.details);
};
