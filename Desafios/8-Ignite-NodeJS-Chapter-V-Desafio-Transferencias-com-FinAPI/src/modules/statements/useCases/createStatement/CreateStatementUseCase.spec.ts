import { v4 as uuidV4 } from "uuid";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

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

  it("should be able to create a new deposit", async () => {
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

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "deposit test",
      amount: 100,
      type: "deposit" as OperationType,
    });

    expect(statement).toHaveProperty("user_id");
    expect(statement).toHaveProperty("description");
    expect(statement).toHaveProperty("amount");
    expect(statement.amount).toEqual(100);
    expect(statement.description).toEqual("deposit test");
    expect(statement.type).toEqual("deposit");
  });

  it("should be able to create a new withdraw", async () => {
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

    const statementDeposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "deposit test",
      amount: 100,
      type: "deposit" as OperationType,
    });

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "withdraw test",
      amount: 100,
      type: "withdraw" as OperationType,
    });

    const iRequestObj = <IRequest>{ user_id: user.id };

    const balance = await getBalanceUseCase.execute(iRequestObj);

    expect(statementDeposit.amount).toEqual(100);
    expect(statementWithdraw.amount).toEqual(100);
    expect(balance.balance).toEqual(0);
  });

  it("should not be able to create a withdraw > balance", async () => {
    await expect(async () => {
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
        amount: 150,
        type: "withdraw" as OperationType,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a deposit for a non existing user", async () => {
    await expect(async () => {
      enum OperationType {
        DEPOSIT = "deposit",
        WITHDRAW = "withdraw",
      }

      await createStatementUseCase.execute({
        user_id: uuidV4() as string,
        description: "deposit test",
        amount: 100,
        type: "deposit" as OperationType,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a withdraw for a user that does not exists", async () => {
    await expect(async () => {
      enum OperationType {
        DEPOSIT = "deposit",
        WITHDRAW = "withdraw",
      }

      await createStatementUseCase.execute({
        user_id: uuidV4() as string,
        description: "withdraw test",
        amount: 100,
        type: "deposit" as OperationType,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});