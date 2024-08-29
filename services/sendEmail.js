/* eslint-disable no-console */
/* eslint-disable no-undef */
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');

const { nodeMailerTransporter } = require('../middleware/transporter');

async function sendEmail(
  userEmail,
  subject,
  templateName,
  emailData = {},
) {
  const templatePath = path.resolve(__dirname, `../templates/${templateName}.html`);
  // need to resolve
  const templateSource = fs.readFileSync(templatePath, 'utf8');

  const template = handlebars.compile(templateSource);

  const html = template(emailData);

  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject,
    html,
  };

  nodeMailerTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

module.exports = sendEmail;