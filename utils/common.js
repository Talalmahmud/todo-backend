import nodemailer from "nodemailer";

export const generateRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const sendEmail = async (message, email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "mahmudtalal2@gmail.com", // sender address
      to: email, // list of receivers
      subject: `Verification code`, // Subject line
      text: message, // plain text body
      html: `<p>Verifiction code is:${message}</p>`, // html body
    });
    if (info) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
