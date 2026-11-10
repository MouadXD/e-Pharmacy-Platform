const sgMail = require("@sendgrid/mail");
const CustomError = require("../utils/customError");

const sendEmail = async ({
  to,
  subject,
  html,
  templateId,
  personalizations,
}) => {
  if (!process.env.SEND_GRID_API_KEY) {
    throw new CustomError("Email service is not configured", 500);
  }

  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

  const message = {
    from: {
      name: "Medicare",
      email: process.env.EMAIL_FROM || "no-reply@medicare.local",
    },
    ...(to ? { to } : {}),
    ...(subject ? { subject } : {}),
    ...(html ? { html } : {}),
    ...(personalizations ? { personalizations } : {}),
    ...(templateId ? { template_id: templateId } : {}),
  };

  const [response] = await sgMail.send(message);

  if (!response?.statusCode || response.statusCode >= 400) {
    throw new CustomError("Email not sent", 500);
  }

  return response;
};

module.exports = sendEmail;
