import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';
import { OperationType } from '../../entities/Statement';


export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const splittedPath = request.originalUrl.split('/');

    let type = splittedPath[splittedPath.length - 1] as OperationType;
    if (type !== 'deposit' && type !== 'withdraw') {
      if (splittedPath[splittedPath.length - 2] === "transfers") {
        type = OperationType.TRANSFER;
      }
    }

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id: id,
      sender_id: user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
