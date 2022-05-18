import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { compare } from "bcrypt";
import { AppError } from "@shared/errors/AppError";
import { sign } from 'jsonwebtoken'
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from '@config/auth';
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest {
  email: string,
  password: string
}

interface IResponse {
  user: {
    name: string,
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {

  constructor(
    @inject("UsersRepository")
    private UsersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokenRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) { }

  async execute({ email, password }: IRequest): Promise<IResponse> {
    //Valida se usuario existe
    const user = await this.UsersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect');
    }
    //Se senha esta correta
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Email or password incorrect');
    }

    //Gerar JsonWebToken, add informações no payload.
    const token = sign({}, auth.secret_token, {
      subject: user.id,
      expiresIn: auth.expires_in_token
    });

    // Gerar o Refresh token.
    const refresh_token = sign({
      email
    }, auth.secret_refresh_token, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token
    });

    const refresh_token_expires_date = this.dayjsDateProvider.addDays(auth.expires_refresh_token_days)

    await this.usersTokenRepository.create({
      expires_date: refresh_token_expires_date,
      refresh_token,
      user_id: user.id
    })


    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      },
      refresh_token
    }

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase }