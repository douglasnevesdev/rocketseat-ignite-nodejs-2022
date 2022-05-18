import { v4 as uuidV4 } from "uuid";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

interface IRequest {
  user_id: string;
  statement_id: string;
}

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create Statements", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get the statement of an operation", async () => {
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

    const iRequestObj = <IRequest>{
      user_id: user.id,
      statement_id: statement.id,
    };

    const result = await getStatementOperationUseCase.execute(iRequestObj);

    expect(result).toEqual(statement);
  });
  it("Should not be able to get a statement operation from a non existent user", async () => {
    await expect(async () => {
      enum OperationType {
        DEPOSIT = "deposit",
        WITHDRAW = "withdraw",
      }

      const statement = await createStatementUseCase.execute({
        user_id: uuidV4() as string,
        description: "deposit test",
        amount: 100,
        type: "deposit" as OperationType,
      });

      const iRequestObj = <IRequest>{
        user_id: statement.user_id,
        statement_id: statement.id,
      };

      await getStatementOperationUseCase.execute(iRequestObj);
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should not be able to get a invalid statement operation from a valid user", async () => {
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

      const iRequestObj = <IRequest>{
        user_id: user.id,
        statement_id: uuidV4(),
      };

      await getStatementOperationUseCase.execute(iRequestObj);
    }).rejects.toBeInstanceOf(AppError);
  });
});