import request, { SuperTest, Test } from "supertest";
import { expect } from "chai";
import { setup } from "../server";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity";
import { LoginInput, LoginType, UserInput, UserType } from "../schema/schema.types";
import { CryptoService } from "../core/security/crypto";
import { JWTService } from "../core/security/jwt";
import { ErrorMessage } from "../core/error";

describe("Tests - GraphQL Server", () => {
  let agent: SuperTest<Test>;
  let repository: Repository<User>;
  const input: UserInput = {
    name: "admin",
    email: "admin@taqtile.com.br",
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

  const createUser = `
    mutation CreateUser($data: UserInput!) {
      createUser(user: $data) {
        id
        name
        email
        birthDate
      }
    }
  `;

  const login = `
    mutation Login($data: LoginInput!) {
      login(data: $data) {
        token
        user {
          id
          email
          name
          birthDate
        }
      }
    }
  `;

  it("should throw an error saying not logged in", async () => {
    const response = await requestQuery(createUser, { data: input });
    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.token.invalid);
    expect(response.body.errors[0].code).to.be.eq(401);
    expect(response.body.errors[0].details).to.be.eq("Token not found");
  });

  it("should login successfully", async () => {
    await createUserEntity(input);

    const data = {
      email: input.email,
      password: input.password,
    };

    const response = await requestQuery(login, { data });
    expect(response.body.data.login.token.indexOf("Bearer ")).to.be.greaterThan(-1);
    expect(response.body.data.login.user.email).to.be.eq(input.email);
    expect(response.body.data.login.user.name).to.be.eq(input.name);
    expect(response.body.data.login.user.birthDate).to.be.eq(input.birthDate);
    expect(+response.body.data.login.user.id).to.be.greaterThan(0);
  });

  it("should create a new user", async () => {
    const token = JWTService.sign({ id: 1 });

    input.email = "email_test@taqtile.com";
    const response = await requestQuery(createUser, { data: input }, token);

    const email = input.email;
    const newUser: UserType = response.body.data.createUser;
    expect(+newUser.id).to.be.greaterThan(0);

    const findOne = await repository.findOne({ email });
    expect(findOne?.email).to.be.eq(email);

    const hashedPassword = CryptoService.encode(input.password);
    expect(findOne?.password).to.be.eq(hashedPassword);
  });

  it("should return a error saying invalid password", async () => {
    const data: UserInput = {
      name: "taqtile",
      email: "taqtiler@taqtile.com.br",
      password: "invalid-password",
    };

    const token = JWTService.sign({ id: 1 });
    const response = await requestQuery(createUser, { data }, token);

    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.badlyFormattedPassword);
    expect(response.body.errors[0].code).to.be.eq(401);
  });

  it("should return a error saying invalid email", async () => {
    const token = JWTService.sign({ id: 1 });

    const newUser: UserInput = {
      name: "new user",
      email: "user@taqtile.com.br",
      password: "1234qwer",
    };
    await createUserEntity(newUser);

    const response = await requestQuery(createUser, { data: newUser }, token);
    expect(response.body.errors[0].message).to.be.eq(ErrorMessage.email);
    expect(response.body.errors[0].code).to.be.eq(401);
  });

  const createUserEntity = async (data: UserInput): Promise<void> => {
    const user = new User();
    user.email = data.email;
    user.name = data.name;
    user.password = CryptoService.encode(data.password);
    user.birthDate = data.birthDate;

    await repository.save(user);
  };

  const requestQuery = (query: string, variables?: any, token?: string): Test => {
    return agent
      .post("/graphql")
      .set("authorization", token ?? "")
      .set("Accept", "application/json")
      .send({
        query,
        variables,
      });
  };
});
