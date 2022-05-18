import { container } from "tsyringe"
import { ProfileUserUseCase } from "./ProfileUserUseCaseUseCase"
import { Request, Response } from 'express';

class ProfileUserUseCaseController {

  async handle(request: Request, response: Response): Promise<Response> {

    const { id } = request.user;
    const profileUserUseCase = container.resolve(ProfileUserUseCase);
    const user = await profileUserUseCase.execute(id);
    return response.json(user);

  }

}

export { ProfileUserUseCaseController }