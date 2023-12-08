const User = require("../models/User");
const jwt = require('jsonwebtoken');

require('dotenv').config();
const jwtKey = process.env.jwtEncryptionKey;

exports.login = async (req, res, next) => {
    try {
        const username = req.body?.Username;
        const password = req.body?.Password;
        let user = await User.findOne({ Username: username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // const passwordMatch = await bcrypt.compare(password, user.Password);
        const passwordMatch = (password === user.Password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        let token = jwt.sign(
            {
                user_id: user._id,
                username: user.Username,
                UserRole: user.Role
            },
            jwtKey
        );
        res.status(200).json({ success: true, message: 'Login successful', Token: token });
    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        const username = req.body?.Username;
        const password = req.body?.Password;
        const confirmPassword = req.body?.confirmPassword;
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Both Passwords should be same' });
        }

        let newUser = await User.findOne({ Username: username });
        if (!newUser) {
            newUser = new User({
                Username: username,
                Password: password,
                Role: 'Anonymous'
            });

            await newUser.save();
            let token = jwt.sign({
                user_id: newUser._id,
                username: newUser.Username,
                UserRole: newUser.Role
            },
                jwtKey
            );
            return res.status(200).json({ success: true, message: 'Signup successful', Token: token });
        } else {
            return res.status(409).json({ message: "Username not available" });
        }
    } catch (err) {
        next(err);
    }
};