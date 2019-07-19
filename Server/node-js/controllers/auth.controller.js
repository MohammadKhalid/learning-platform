const authService       = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');

const login = async function(req, res){
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;