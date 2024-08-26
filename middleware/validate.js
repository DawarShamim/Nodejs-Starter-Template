const { formValidation } = require('../constants');
const { failureResponse } = require('../utils/common');

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorDetails = error.details.reduce((accumulator, detail) => {
        accumulator[detail.context.key] = detail.message;
        return accumulator;
      }, {});
      return failureResponse(res, 422, formValidation, errorDetails);
    }
    req.validateData = value;
    next();
  };
}

module.exports = validate;