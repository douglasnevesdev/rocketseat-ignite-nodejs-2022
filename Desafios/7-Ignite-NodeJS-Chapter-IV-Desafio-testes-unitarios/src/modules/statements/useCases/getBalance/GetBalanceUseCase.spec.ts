import { v4 as uuidV4 } from "uuid";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

interface IRequest {
  user_id: string;
}

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statements", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to get the balance of an User", async () => {
    enum OperationType {
      DEPOSIT = "deposit",
      WITHDRAW = "withdraw",
    }
    const userDTO: ICreateUserDTO = {
      name: "user",
      email: "email@test.com",
      password: "12345",
    };

    const user = await createUserUseCase.execute(userDTO);

    await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "deposit test",
      amount: 100,
      type: "deposit" as OperationType,
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "withdraw test",
      amount: 50,
      type: "withdraw" as OperationType,
    });

    const iRequestObj = <IRequest>{ user_id: user.id };

    const balance = await getBalanceUseCase.execute(iRequestObj);

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
    expect(balance.statement[0]).toHaveProperty("id");
    expect(balance.balance).toEqual(50);
  });

  it("should not be able to get balance of a non existent user", async () => {
    const iRequestObj = <IRequest>{ user_id: uuidV4() };

    await expect(async () => {
      await getBalanceUseCase.execute(iRequestObj);
    }).rejects.toBeInstanceOf(AppError);
  });
});