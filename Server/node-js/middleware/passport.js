const { ExtractJwt, Strategy } = require('passport-jwt');
const { User }      = require('../models');
const CONFIG        = require('../config/config');
const {to}          = require('../services/util.service');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        let err, user;
        [err, user] = await to(User.findByPk(jwt_payload.user_id));

        if(err) return done(err, false);
        if(user) {
            return user.type === passport.accessType ? done(null, user) : done(null, false);
        }else{
            return done(null, false);
        }
    }));
}