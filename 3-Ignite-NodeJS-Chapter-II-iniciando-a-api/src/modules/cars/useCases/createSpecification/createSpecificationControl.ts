import { Request, Response } from "express";
import { CreateSpecificationUsesCase } from '../createSpecification/CreateSpecificationUseCase';

class CreateSpecificationController {

  constructor(private createSpecificationUseCase: CreateSpecificationUsesCase) { }

  handle(request: Request, response: Response) {
    const { name, description } = request.body;
    this.createSpecificationUseCase.execute({ name, description });
    return response.status(201).send();
  }
}

export { CreateSpecificationController }