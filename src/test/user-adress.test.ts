import { expect } from "chai";
import { AddressInput } from "schema/schema.types";
import request, { SuperTest, Test } from "supertest";
import { Repository, getRepository } from "typeorm";

import { User, Address } from "../entity";

describe("Tests User Adress", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;
  const userAdress: AddressInput = {
    state: "São Paulo",
    city: "São Paulo",
    neighborhood: "Sumaré",
    street: "",
    number: 10,
  };

  before(async () => {
    agent = request(process.env.BASE_URL);
    repository = getRepository(User);
  });

  const createAddressEntity = (address: AddressInput) => {
    const userAddress = new Address();
    userAddress.state = address.state;
    userAddress.city = address.city;
    userAddress.neighborhood = address.neighborhood;
    userAddress.street = address.street;
    userAddress.number = address.number;

    return userAdress;
  };
});
