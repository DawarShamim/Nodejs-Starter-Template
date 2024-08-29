const Joi = require('joi');
const { vMsg } = require('../constants');

exports.loginJoi = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': vMsg.str,
    'any.required': vMsg.req

  }),
  password: Joi.string().required().messages({
    'string.empty': vMsg.str,
    'any.required': vMsg.req
  })
});

exports.signupJoi = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': vMsg.str,
    'any.required': vMsg.req

  }),
  email: Joi.string().email().required().messages({
    'string.empty': vMsg.str,
    'string.email': vMsg.email,
    'any.required': vMsg.req
  }),

  password: Joi.string().required().messages({
    'string.empty': vMsg.str,
    'any.required': vMsg.req
  }),
  confirmPassword: Joi.string().required().messages({
    'string.empty': vMsg.str,
    'any.required': vMsg.req
  })
});