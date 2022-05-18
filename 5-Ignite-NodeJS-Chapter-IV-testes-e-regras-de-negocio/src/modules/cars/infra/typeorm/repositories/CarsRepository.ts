import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {

  private repository: Repository<Car>

  constructor() {
    this.repository = getRepository(Car);
  }


  async create({
    name,
    brand,
    category_id,
    description,
    license_plate,
    daily_rate,
    fine_amount,
    id
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      name,
      brand,
      category_id,
      description,
      license_plate,
      daily_rate,
      fine_amount,
      id
    });

    this.repository.save(car);

    return car;
  }

  async list(): Promise<Car[]> {
    const allCars = await this.repository.find()
    return allCars
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({ license_plate });
    return car;
  }

  async findAvailable(brand?: string, category_id?: string, name?: string): Promise<Car[]> {

    const carsQuery = await this.repository
      .createQueryBuilder("c")
      .where("available = :available", { available: true });

    if (brand) {
      carsQuery.andWhere("c.brand = :brand ", { brand });
    }

    if (name) {
      carsQuery.andWhere("c.name = :name ", { name });
    }

    if (category_id) {
      carsQuery.andWhere("c.category_id = :category_id ", { category_id });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async findById(id: string): Promise<Car> {
    const car = await this.repository.findOne(id);
    return car;
  }

  async updateCarAvailability(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

}

export { CarsRepository }