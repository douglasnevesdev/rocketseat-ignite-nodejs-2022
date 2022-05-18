import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from "nodemailer";
import handlebars from 'handlebars';
import fs from 'fs';
import { SES } from 'aws-sdk';


@injectable()
class SESMailProvider implements IMailProvider {

  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: "2010-12-01",
        region: process.env.AWS_REGION
      })
    });
  }

  async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
    const templateFilterContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFilterContent);

    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to,
      from: "Rentx <d88.neves@gmail.com>",
      subject,
      html: templateHTML,
    });

  }

}

export { SESMailProvider }