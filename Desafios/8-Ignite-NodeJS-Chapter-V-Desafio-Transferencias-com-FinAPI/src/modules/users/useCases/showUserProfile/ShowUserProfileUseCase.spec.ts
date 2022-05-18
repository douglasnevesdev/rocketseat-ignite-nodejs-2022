import { v4 as uuidV4 } from "uuid";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

interface ICreateUserDTOTest {
  id?: string;
  name: string;
  email: string;
  password: string;
}

describe("Show Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });
  it("Should be able to show User's profile", async () => {
    const userDTO: ICreateUserDTO = {
      name: "user",
      email: "email@test.com",
      password: "password",
    };

    const userCreated = await createUserUseCase.execute(userDTO);

    const result = await showUserProfileUseCase.execute(
      userCreated.id as string
    );

    expect(userCreated).toEqual(result);
  });
  it("Should not be able to show User's profile of a invalid User", async () => {
    const nonUser: ICreateUserDTOTest = {
      id: uuidV4(),
      name: "user",
      email: "email@test.com",
      password: "password",
    };

    await expect(async () => {
      await showUserProfileUseCase.execute(nonUser.id as string);
    }).rejects.toBeInstanceOf(AppError);
  });
});