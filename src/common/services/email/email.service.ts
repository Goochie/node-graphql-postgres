import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { mgauth } from '../../config';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { ConfigService } from '../config.service';
@Injectable()
export class EmailService {
  partials = {
    partHeader: null,
    partFooter: null,
  };

  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {
    const partials = config.getOptions().partialPath;
    const layoutHeader = fs.readFileSync( partials + 'header.hbs', 'UTF-8');
    this.partials.partHeader = handlebars.compile(layoutHeader, {strict: true});
    const footerHeader = fs.readFileSync( partials + 'footer.hbs', 'UTF-8');
    this.partials.partFooter = handlebars.compile(footerHeader, {strict: true});
  }

  async sendEmail( to, subject, template, context) {
    const parts: any = {};
    for (const  key in this.partials) {
      if (this.partials.hasOwnProperty(key)) {
        parts[key] = this.partials[key](context);
      }
    }

    return this.mailerService.sendMail({
      subject,
      from: `SLP <no-replay@${mgauth.auth.domain}>`,
      template,
      context: Object.assign(context, {parts}),
      to,
    });
  }
}
