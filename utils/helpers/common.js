function getOtp() {
    return Math.floor(1000 + Math.random() * 9000);
};


function generateToken (userData){
    const jwtKey = process.env.jwtEncryptionKey;

    let token = jwt.sign(
        {
            user_id: userData._id,
            username: userData.username,
            UserRole: userData.role
        },
        jwtKey
    );
    return token
}

module.exports = { getOtp ,generateToken}