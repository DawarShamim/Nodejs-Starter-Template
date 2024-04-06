
const secretKey = process.env.jwtEncryptionKey;
const UserModel = require("../models/User");

exports.verifyEmail = async (req, res, next) => {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ success: false, message: "Invalid Parameters" })
        }
        const decoded = jwt.verify(token, secretKey);
        if (decoded) {
            const existingUser = await UserModel.findById(userId);
            if (existingUser && existingUser.otp === decoded.otp) {

                if (existingUser.otpExpiry >= Date.now()) {

                    await UserModel.findOneAndUpdate(
                        { _id: decoded._id },
                        { isVerified: true, otp: null, otpExpiry: null },
                        { new: true, runValidators: true }
                    );
                    return res.status(201).send({ success: true, message: 'Email Verified' });
                }
                return res.status(422).send({ success: false, message: 'OTP Expired' });
            }
            return res.status(403).send({ success: false, message: 'Failed to authenticate.' });
        }
        return res.status(412).send({ success: false, message: 'Invalid Token' });
    } catch (err) {
        next(err)

    }
};
