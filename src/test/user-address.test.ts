import { expect } from "chai";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";

import { User } from "../entity";
import { AddressInput, CreateUserInput } from "../schema/schema.types";
import { createUserEntity, createAddressAndSave } from "./common";

describe("Tests User Address", () => {
  let agent: SuperTest<Test>;
  let userRepository: Repository<User>;

  const input: CreateUserInput = {
    name: "admin",
    email: "admin@taqtile.com.br",
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
    userRepository = getRepository(User);
  });

  afterEach(async () => {
    await userRepository.delete({});
  });

  it("should save in repository", async () => {
    const address1 = await createAddressAndSave(fakeAddress1);
    const address2 = await createAddressAndSave(fakeAddress2);
    const user = await createUserEntity(input);

    user.address = [address1, address2];
    await userRepository.save(user);

    const response = await userRepository.findOne({ email: user.email }, { relations: ["address"] });

    expect(response?.address?.[0].id).to.be.deep.eq(address1.id);
    expect(response?.address?.[1].id).to.be.deep.eq(address2.id);
  });
});
