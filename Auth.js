const jwt = require('jsonwebtoken');
const passport = require("passport");

const Authentication = passport.authenticate("jwt", { session: false });

module.exports =  Authentication ;