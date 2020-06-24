const settings = require('./settings');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(settings.sgApiKey);

module.exports = async (msg) => {
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
};