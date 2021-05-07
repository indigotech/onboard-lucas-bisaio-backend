import request, { Test } from "supertest";
import { expect } from "chai";
import { setup } from "../server";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity";
import { UserInput, UserResponse } from "../schema";

describe("Tests - GraphQL Server", () => {
  let agent: Test;
  let repository: Repository<User>;

  before(async () => {
    await setup();
    agent = request(`${process.env.BASE_URL}${process.env.SERVER_PORT}`).post(
      "/graphql"
    );
    agent.set("Accept", "application/json");
    repository = getRepository(User);
  });

  beforeEach(async () => {
    await repository.delete({});
  });

  it("should return a hello world", async () => {
    const query = "{ hello }";
    const queryResponse = await agent.send({ query });
    expect(queryResponse.body.data.hello).to.be.eq("Hello World!");
  });

  const mutation = `
    mutation CreateUser($data: UserInput!) {
      createUser(data: $data) {
        id
        name
        email
        birthDate
      }
    }
  `;

  it("should create a new user", async () => {
    const input: UserInput = {
      name: "newUser",
      email: "user@taqtile.com.br",
      password: "1234qwer",
    };

    const response = await agent.send({
      query: mutation,
      variables: { data: input },
    });

    const newUser: UserResponse = response.body.data;

    expect(newUser.name).to.be.eq(input.name);
    expect(newUser.email).to.be.eq(input.email);
    expect(newUser.birthDate).to.be.eq(input.birthDate);
    expect(newUser.password).to.not.be.eq(input.password);
  });
});
