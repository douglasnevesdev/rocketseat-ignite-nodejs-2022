import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {


  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });


  it('should be able to authenticate an user', async () => {

    const user: ICreateUserDTO = {
      driver_license: "00123",
      email: 'user@gmail.com',
      password: '1234',
      name: 'Test User'
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty('token');

  });


  it('should not be able to authenticate an none existent user', () => {
    expect(async () => {

      await authenticateUserUseCase.execute({
        email: 'false@teste.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(AppError);
  });


  it('should not be able to authenticate with incorrect password', () => {

    expect(async () => {

      const user: ICreateUserDTO = {
        driver_license: "00000",
        email: 'user@test.com',
        password: '1234',
        name: 'Test User'
      }

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '0000'
      });

    }).rejects.toBeInstanceOf(AppError);

  });

});