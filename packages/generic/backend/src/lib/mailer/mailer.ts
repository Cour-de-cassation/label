import SendGrid from '@sendgrid/mail';

export { mailer };

const mailer = buildMailer();

function buildMailer() {
  const emitter = 'benoit.serrano@yahoo.fr';
  SendGrid.setApiKey(process.env.SENDGRID || '');
  return { sendMail };

  async function sendMail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }) {
    const message = { to, from: emitter, subject, text };
    await SendGrid.send(message);
  }
}
