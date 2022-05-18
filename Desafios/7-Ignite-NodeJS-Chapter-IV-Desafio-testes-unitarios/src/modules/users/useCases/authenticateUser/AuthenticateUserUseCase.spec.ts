import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an existing user", async () => {
    const userData = {
      name: "Test Name",
      email: "Test Email",
      password: "Test Password",
    };

    await createUserUseCase.execute(userData);

    const { user, token } = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(user).toHaveProperty("id");
    expect(token).not.toBeNull();
  });

  it("should not be able to authenticate an no-existing user", async () => {
    const userData = {
      name: "Test Name",
      email: "Test Email",
      password: "Test Password",
    };

    await expect(
      authenticateUserUseCase.execute({
        email: userData.email,
        password: userData.password,
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const userData = {
      name: "Test Name",
      email: "Test Email",
      password: "Test Password",
    };

    await createUserUseCase.execute(userData);

    await expect(
      authenticateUserUseCase.execute({
        email: userData.email,
        password: "wrong password",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});