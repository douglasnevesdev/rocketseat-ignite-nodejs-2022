import { Request, Response } from 'express';
import { container } from "tsyringe";
import { AuthenticateUserCase } from "./authenticateUserCase";

class AuthenticateUserController {

  async handle(request: Request, response: Response): Promise<Response> {

    const { email, password } = request.body;

    const authenticateUserCase = container.resolve(AuthenticateUserCase);

    const token = await authenticateUserCase.execute({ password, email });

    return response.json(token);
  }

}

export { AuthenticateUserController }