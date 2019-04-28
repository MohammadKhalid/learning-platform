const { User, Sequelize } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const Op = Sequelize.Op;

let participantsIn = async function (req, res, next) {
    let err;
    let items = req.body.participants || [];
    let ids = [];

    for (var i = items.length - 1; i >= 0; i--) {
        ids.push(items[i].id);
    }

    [err, items] = await to(User.findAll({where:{ id: { [Op.in]: ids } }}));
    if(err) return ReE(res, err, "err finding users");

    req.participants = items;

    next();
}
module.exports.participantsIn = participantsIn;