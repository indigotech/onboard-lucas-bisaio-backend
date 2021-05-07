import request, { SuperTest, Test } from "supertest";
import { expect } from "chai";
import { setup } from "../server";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity";
import { UserInput, UserResponse } from "../schema";
import { CryptoService } from "../core/security/crypto";

describe("Tests - GraphQL Server", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;
  const input: UserInput = {
    name: "new user",
    email: "user@taqtile.com.br",
    password: "1234qwer",
    birthDate: "01-01-2000",
  };

  before(async () => {
    await setup();
    agent = request(`${process.env.BASE_URL}${process.env.SERVER_PORT}`);
    repository = getRepository(User);
    repository.delete({});
  });

  const configAgent = async (query: string, variables?: any): Promise<Test> => {
    return await agent.post("/graphql").set("Accept", "application/json").send({
      query,
      variables,
    });
  };

  it("should return a hello world", async () => {
    const query = "{ hello }";
    const queryResponse = await configAgent(query);
    expect(queryResponse.body.data.hello).to.be.eq("Hello World!");
  });

  const mutation = `
    mutation CreateUser($data: UserInput!) {
      createUser(user: $data) {
        id
        name
        email
        birthDate
      }
    }
  `;

  it("should create a new user", async () => {
    const response = await configAgent(mutation, { data: input });

    const newUser: UserResponse = response.body.data.createUser;
    expect(+newUser.id).to.be.greaterThan(0);
  });

  it("should search for the new user on database", async () => {
    const email = input.email;

    const findOne = await repository.findOne({ email });
    expect(findOne?.email).to.be.eq(email);
  });

  it("should verify if the password was hashed", async () => {
    const hashedPassword = CryptoService.encode(input.password);
    const email = input.email;

    const findOne = await repository.findOne({ email });
    expect(findOne?.password).to.be.eq(hashedPassword);
  });
});
