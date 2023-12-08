const User = require("../models/User");

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
        res.status(200).json({ success: true, message: 'Login successful' });
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
            // Save the new user within the ongoing transaction
            await newUser.save();
        } else {
            return res.status(409).json({ message: "Username not available" });
        }

        res.status(200).json({ success: true, message: 'Signup successful' });
    } catch (err) {
        next(err);
    }
};