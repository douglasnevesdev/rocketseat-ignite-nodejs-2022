import { Router } from 'express';
import { categoriesRoutes } from '../routes/categories.routes';
import { specificationRoutes } from '../routes/specifications.routes';
import { usersRouter } from '../routes/users.routes';
import { authenticateRoutes } from '../routes/authenticate.routes';
import { carsRoutes } from '../routes/cars.routes';
import { rentalRoutes } from '../routes/rental.routes';

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationRoutes);
router.use("/users", usersRouter);
router.use("/cars", carsRoutes);
router.use(authenticateRoutes);
router.use("/rentals", rentalRoutes);

export { router };