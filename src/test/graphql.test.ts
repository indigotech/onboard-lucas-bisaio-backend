import request, { SuperTest, Test } from "supertest";
import { expect } from "chai";
import { setup } from "../server";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity";
import { UserInput, UserResponse } from "../schema";
import { CryptoService } from "../core/security/crypto";
import { ErrorMessage } from "../core/error";

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
  });

  afterEach(() => {
    repository.delete({});
  });

  it("should return a hello world", async () => {
    const query = "{ hello }";
    const response = await requestQuery(query);
    expect(response.body.data.hello).to.be.eq("Hello World!");
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
    const email = input.email;
    const response = await requestQuery(mutation, { data: input });

    const newUser: UserResponse = response.body.data.createUser;
    expect(+newUser.id).to.be.greaterThan(0);

    const findOne = await repository.findOne({ email });
    expect(findOne?.email).to.be.eq(email);

    const hashedPassword = CryptoService.encode(input.password);
    expect(findOne?.password).to.be.eq(hashedPassword);
  });

  it("should return a error saying invalid password", async () => {
    const user: UserInput = {
      name: "taqtile",
      email: "taqtiler@taqtile.com.br",
      password: "invalid-password",
    };

    const response = await requestQuery(mutation, { data: user });
    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.badlyformattedPassword);
    expect(response.body.errors[0].code).to.be.eq(401);
  });

  it("should return a error saying invalid email", async () => {
    const user = new User();
    user.email = input.email;
    user.name = input.name;
    user.password = CryptoService.encode(input.password);
    user.birthDate = input.birthDate;

    await repository.save(user);

    const response = await requestQuery(mutation, { data: input });
    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.email);
    expect(response.body.errors[0].code).to.be.eq(401);
  });

  const requestQuery = (query: string, variables?: any): Test => {
    return agent.post("/graphql").set("Accept", "application/json").send({
      query,
      variables,
    });
  };
});
