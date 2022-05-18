import { User } from '../../entities/User';
import { IUsersRepository } from "../IUsersRepository";
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO'
import { getRepository, Repository } from "typeorm";

class UserRepository implements IUsersRepository {

  private repository: Repository<User>

  constructor() {
    this.repository = getRepository(User);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }

  async create({
    name,
    email,
    driver_license,
    password,
    id,
    avatar
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
      email,
      driver_license,
      password,
      id,
      avatar
    });
    await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      email,
    });
    return user;
  }

}

export { UserRepository }