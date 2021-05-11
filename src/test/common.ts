import { getRepository } from "typeorm";
import { Test, SuperTest } from "supertest";

import { CryptoService } from "../core/security/crypto";
import { User } from "../entity";
import { CreateUserInput } from "../schema/schema.types";

export const createUserEntity = async (data: CreateUserInput): Promise<void> => {
  const user = new User();
  user.email = data.email;
  user.name = data.name;
  user.password = CryptoService.encode(data.password);
  user.birthDate = data.birthDate;

  await getRepository(User).save(user);
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
