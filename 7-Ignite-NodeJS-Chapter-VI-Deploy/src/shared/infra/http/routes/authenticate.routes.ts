import { Router } from 'express';
import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { RefreshController } from '@modules/accounts/useCases/refreshToken/RefreshTokenController';

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshController = new RefreshController();

authenticateRoutes.post('/session', authenticateUserController.handle);
authenticateRoutes.post('/refresh-token', refreshController.handle);

export { authenticateRoutes };