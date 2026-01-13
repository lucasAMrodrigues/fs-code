import nodemailer from 'nodemailer';

export default async (email, nome, message, anexo) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const mailOptions = {
  from: '"Teste de Sistema" <no-reply@exemplo.com>', // Nome e e-mail fictício
  to: email, // Este valor deve ser um e-mail válido vindo da requisição
  subject: `${nome} te enviou uma mensagem de teste`,
  html: `<p>Você recebeu uma nova mensagem de <strong>${nome}</strong> (${email}):</p><p>${message}</p>`,
  text: message,
};

  if (anexo) {
    mailOptions.attachments = [{
      filename: anexo.originalname,
      content: anexo.buffer,
    }];
  }

  const info = await transporter.sendMail(mailOptions);
  await transporter.close();
  return info;
};
