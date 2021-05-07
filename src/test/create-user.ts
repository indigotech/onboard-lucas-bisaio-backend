import { setup } from "../server";
import request, { Test } from "supertest";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity";

describe("Test - CreateUser Mutation - GraphQL", () => {
  let repository: Repository<User>;
  let agent: Test;

  const variables = {
    data: {
      name: "admin",
      email: "admin@taqtile.com.br",
      password: "1234qwer",
      birthDate: "01-01-1900",
    },
  };

  const query = `
    mutation CreateUser($data: UserInput!) {
      createUser(data: $data) {
        id
        name
        email
        birthDate
      }
    }
  `;

  before(async () => {
    await setup();
    agent = request(`${process.env.BASE_URL}${process.env.SERVER_PORT}`).post(
      "/graphql"
    );
    agent.set("Accept", "application/json");

    repository = getRepository(User);
  });

  it("Should Create a New User", async () => {
    const response = await agent.send({ query, variables }).expect(200);

    console.log(response);
  });
});
