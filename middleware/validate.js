const { formValidation } = require("../constants");

function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false })
        if (error) {
            const errorDetails = error.details.reduce((accumulator, detail) => {
                accumulator[detail.context.key] = detail.message;
                return accumulator;
            }, {});

            return res.status(422).json({ success: false, message: formValidation, errorDetails })
        }
        req.validateData = value;
        next();
    }
}

module.exports = validate;