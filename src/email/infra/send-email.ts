import * as nodemailer from 'nodemailer';

const EMAIL_USER = ''; // TODO: Use AWS Secrets Manager
const EMAIL_PASS = '';

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  const user = EMAIL_USER;
  const pass = EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email', error);
  }
}
