const formValidation = 'form Validation';
const userNotFound = 'user not found';
const SUCCESS = 'success';
const vMsg = {
  str: 'value must be string',
  req: 'value is required',
  email: 'value must be an email',
};

const SocketEvent = {
  NOTIFICATION: 'notification'
};

const emailSub = {
  RESET_PASSWORD: 'Reset Password',
  VERIFY_EMAIL: 'Verify Email'

};
const emailTemplate = {
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL:'emailVerification'
};
module.exports = {
  SUCCESS,
  SocketEvent,
  formValidation,
  userNotFound,
  vMsg,
  emailSub,
  emailTemplate,

};