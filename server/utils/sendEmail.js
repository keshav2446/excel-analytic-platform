const nodemailer = require("nodemailer");

const TEST_EMAIL_ADDRESS =
  "irving.gerlach@ethereal.email" || process.env.EMAIL_FROM;
const TEST_EMAIL_PASSWORD = "faEatsmf8JATNj629Y" || process.env.EMAIL_PASSWORD;

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, //true for 465
    auth: {
      user: TEST_EMAIL_ADDRESS,
      pass: TEST_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: TEST_EMAIL_ADDRESS, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: `<b>${text}</b>`, // html body
  });
};

module.exports = sendEmail;
