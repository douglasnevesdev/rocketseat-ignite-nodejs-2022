import { Router } from 'express';
import uploadConfig from '@config/upload';

import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';

import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';

import multer from 'multer';
import { ProfileUserUseCaseController } from '@modules/accounts/useCases/profileUserUseCase/ProfileUserUseCaseController';

const uploadAvatar = multer(uploadConfig);

const usersRouter = Router();

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const profileUserController = new ProfileUserUseCaseController();

usersRouter.post('/', createUserController.handle);

usersRouter.patch('/avatar', ensureAuthenticated, uploadAvatar.single('avatar'), updateUserAvatarController.handle);

usersRouter.get('/profile', ensureAuthenticated, profileUserController.handle);

export { usersRouter };