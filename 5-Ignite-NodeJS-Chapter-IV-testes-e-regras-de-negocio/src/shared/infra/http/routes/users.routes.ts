import { Router } from 'express';
import uploadConfig from '@config/upload';

import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';

import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';

import multer from 'multer';

const uploadAvatar = multer(uploadConfig.upload('./tmp/avatar'));

const usersRouter = Router();

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRouter.post('/', createUserController.handle);

usersRouter.patch('/avatar', ensureAuthenticated, uploadAvatar.single('avatar'), updateUserAvatarController.handle);

export { usersRouter };