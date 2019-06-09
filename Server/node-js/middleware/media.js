const { Media, Sequelize }  = require('./../models');
const { to, ReE, ReS }      = require('../services/util.service');
const Op = Sequelize.Op;

let item = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(Media.findOne({where:{id:item_id}}));
    if(err) return ReE(res, "err finding media");

    if(!item) return ReE(res, "Media not found with id: "+item_id);

    req.item = item;
    next();
}
module.exports.item = item;

let itemsIn = async function (req, res, next) {
    let err, items;
    let sequelize_op = Media.sequelize.Op;
    let data_items = req.body.medias;

    [err, items] = await to(Media.findAll({where:{ id: { [Op.in]: data_items } }}));
    if(err) return ReE(res, err, "err finding media");

    req.medias = items;
    next();
}
module.exports.itemsIn = itemsIn;

let questionMediasIn = async function (req, res, next) {
    let err;
    let sequelize_op = Media.sequelize.Op;
    let questions = req.body.questions;

    for (var i = questions.length - 1; i >= 0; i--) {
    	let mediaIds = [];

    	for (var ii = questions[i].question.medias.length - 1; ii >= 0; ii--) {
    		mediaIds.push(questions[i].question.medias[ii].id);
    	}

    	[err, questions[i].question.medias] = await to(Media.findAll({where:{ id: { [Op.in]: mediaIds } }}));
    	if(err) return ReE(res, err, "err finding media");	
    }

    req.questions = questions;

    next();
}
module.exports.questionMediasIn = questionMediasIn;