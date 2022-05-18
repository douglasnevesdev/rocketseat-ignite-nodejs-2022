import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject("SpecificationsRepository")
    private specificationRepository: ISpecificationsRepository
  ) { }

  async execute({ name, description }: IRequest): Promise<void> {
    const SpecificationsAltreadyExists = await this.specificationRepository.findByName(
      name
    );

    if (SpecificationsAltreadyExists) {
      throw new AppError("Specification already exists!");
    }

    await this.specificationRepository.create({
      name,
      description,
    });
  }
}

export { CreateSpecificationUseCase };
