const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/helpers/common");
const { logData } = require("../utils/logger");

require('dotenv').config();



exports.login = async (req, res, next) => {
    try {
        const username = req.body?.Username;
        const password = req.body?.Password;
        let user = await User.findOne({ Username: username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // const passwordMatch = await bcrypt.compare(password, user.Password);
        const passwordMatch = (password === user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        let token = generateToken(user);
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
                username: username,
                password: password,
                role: 'Anonymous'
            });

            await newUser.save();

            // verify  the account by sending a verification email to the registered Email ID of the user
            // business logic to be added
            let token = generateToken(newUser);

            return res.status(200).json({ success: true, message: 'Signup successful', Token: token });
        } else {
            return res.status(409).json({ message: "Username not available" });
        }
    } catch (err) {
        next(err);
    }
};

exports.loggign = async (req, res) => {
    for (let i = 0; i < 10; i++) {
        console.log("abc", i);
        logData(`key${i}`, { message: `writing this data${i}` });
    }
    return res.status(200).json({ success: true, message: "AAA" });
};
