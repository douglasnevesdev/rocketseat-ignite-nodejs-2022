import { Rental } from "../infra/typeorm/entities/Rental";
import { ICreateRentalDTO } from "@modules/rentals/dto/ICreateRentalDTO";

interface IRentalsRepository {
  findOpenRentalByCar(car_id: string): Promise<Rental>
  findOpenRentalByUser(user_id: string): Promise<Rental>
  create(data: ICreateRentalDTO): Promise<Rental>
}

export { IRentalsRepository }