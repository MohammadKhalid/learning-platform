const passport = require('passport');

let accessLevel = {
    client: (req, res, next) => { passport.accessType = 'client'; next(); },
    student: (req, res, next) => { passport.accessType = 'student'; next(); },
    coach: (req, res, next) => { passport.accessType = 'coach'; next(); },
    admin: (req, res, next) => { passport.accessType = 'admin'; next(); }
};
module.exports.accessLevel = accessLevel;