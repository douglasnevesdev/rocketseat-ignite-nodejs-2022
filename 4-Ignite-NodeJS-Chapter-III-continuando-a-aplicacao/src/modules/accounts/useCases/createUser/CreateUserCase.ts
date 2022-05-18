import { inject, injectable } from "tsyringe";
import { hash } from 'bcrypt';
import { AppError } from '../../../../errors/AppError';
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class CreateUserCase {

  constructor(
    @inject("UserRepository")
    private userRepository: IUsersRepository) { }

  async execute({
    name,
    email,
    password,
    driver_license
  }: ICreateUserDTO): Promise<void> {

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError("User already exists");
    }

    const passwordHash = await hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
      driver_license
    });
  }
}

export { CreateUserCase }