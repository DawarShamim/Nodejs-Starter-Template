exports.throwError(res, message, code, error);
return res.status(code).json({ success: false, message, error });
