const mongoose =require('mongoose');

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    Password: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        enum: ['Anonymous', 'Admin'],
        default: 'Anonymous'
    },
});

UserSchema.pre('save', async function (next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) {
        return next();
    }
    const passwordRegex = /^(?=(.*\d){1,})(?=(.*\W){1,})(?!.*\s).{8,20}$/;
    if (!passwordRegex.test(this.password)) {
        const error = new Error('Passowrd should be between 8-20 characters must containing a number and a special character');
        return next(error);
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User',UserSchema);
module.exports=User;

