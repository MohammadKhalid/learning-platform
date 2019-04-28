const { to, ReE, ReS } = require('../services/util.service');

let user = async function (req, res, next) {
    
    let user_types_array, user;

    user = req.user;
    unauthorized_user_types_array = ['student'];

    if(unauthorized_user_types_array.includes(user.type)) return ReE(res, "Permission denied!");

    next();
}
module.exports.user = user;

let live_group_training = async function (req, res, next) {
    
    let user_types_array, user;

    user = req.user;
    unauthorized_user_types_array = ['student'];

    if(unauthorized_user_types_array.includes(user.type)) return ReE(res, "Permission denied!");

    next();
}
module.exports.live_group_training = live_group_training;