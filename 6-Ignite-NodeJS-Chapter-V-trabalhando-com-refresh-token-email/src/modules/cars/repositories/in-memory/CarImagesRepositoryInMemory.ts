

import { CarImage } from '../../infra/typeorm/entities/CarImage'
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

export class CarImagesRepositoryInMemory implements ICarsImagesRepository {
  private carImages: CarImage[]
  constructor() {
    this.carImages = []
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = new CarImage()
    Object.assign(carImage, { car_id, image_name });
    this.carImages.push(carImage)
    return carImage
  }
}
