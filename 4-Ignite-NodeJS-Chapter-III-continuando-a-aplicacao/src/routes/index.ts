import { Router } from 'express';
import { categoriesRoutes } from '../routes/categories.routes';
import { specificationRoutes } from '../routes/specifications.routes';
import { usersRouter } from '../routes/users.routes';
import { authenticateRoutes } from '../routes/authenticate.routes';

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationRoutes);
router.use("/users", usersRouter);
router.use(authenticateRoutes);

export { router };