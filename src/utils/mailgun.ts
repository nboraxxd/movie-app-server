import formData from 'form-data'
import Mailgun, { MailgunMessageData } from 'mailgun.js'

import { SendEmailParams } from '@/types/token.type'
import envVariables from '@/schemas/env-variables.schema'

export async function sendEmail({ name, email, subject, html }: SendEmailParams) {
  const mailgun = new Mailgun(formData)
  const client = mailgun.client({ username: 'api', key: envVariables.MAILGUN_API_KEY })

  const data: MailgunMessageData = {
    from: 'nmovies <no-reply@nmovies.com>',
    to: `${name} <${email}>`,
    subject,
    html,
  }

  await client.messages.create(envVariables.MAILGUN_DOMAIN, data)
}
