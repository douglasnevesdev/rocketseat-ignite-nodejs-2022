import { SendMailDTO } from '../dtos/SendMailDTO'
import { IMailProvider } from '../IMailProvider'

export class MailProviderInMemory implements IMailProvider {

  private message: any[] = [];


  async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
    this.message.push({
      to,
      subject,
      variables,
      path
    });
  }

  /*
  private emailData: unknown[]
  constructor() {
    this.emailData = []
  }

  async sendMail(data: SendMailDTO): Promise<void> {
    this.emailData.push({ ...data })
  }
  */



}
