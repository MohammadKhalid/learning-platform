const { User, Company } = require('./../models');
const { to, ReE, ReS } = require('../services/util.service');

let client = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.clientId || req.body.clientId;

    [err, item] = await to(User.findByPk(item_id));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);
    req.client = item;
    next();
}
module.exports.client = client;