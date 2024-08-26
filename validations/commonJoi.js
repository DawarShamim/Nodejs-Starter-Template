const Joi = require('joi');

exports.loginJoi = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'username is required',
    'any.required': 'username is required'

  }),
  password: Joi.string().required().messages({
    'string.empty': 'password is required',
    'any.required': 'password is required'
  })
});

exports.signupJoi = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'username is required',
    'any.required': 'username is required'

  }),
  password: Joi.string().required().messages({
    'string.empty': 'password is required',
    'any.required': 'password is required'
  }),
  confirmPassword: Joi.string().required().messages({
    'string.empty': 'confirmPassword is required',
    'any.required': 'confirmPassword is required'
  })
});