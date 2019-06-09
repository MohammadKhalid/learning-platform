const { LiveGroupTraining, Sequelize } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, item;
    let user = req.user;

    let item_info = req.body;
    let participants = req.participants;

    // speaker id
    item_info.speakerId = user.id;

    [err, item] = await to(LiveGroupTraining.create(item_info));
    if(err) return ReE(res, err, 422);

    // participants
    if(participants.length > 0) {
        [err, participants] = await to(item.setParticipants(participants));
        if(err) return ReE(res, err);

        [err, item] = await to(item.save());
        if(err) return ReE(res, err);
    }

    let item_json = item.toWeb();

    return ReS(res, {item: item_json, msg: item_json.title + ' has been added!'}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;

    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;
    
    // query args
    let whereArgs = {};
    let qParams = {
        include: [
            { 
                association: 'participants',
                attributes: ['id']
            },
            'speaker'
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage,
        order: [
            ['status', 'ASC'],
            ['date', 'ASC'],
            ['time', 'ASC']
        ]
    };

    // search keyword
    if(req.query.searchQuery) whereArgs.title = { [Op.like]: '%' + req.query.searchQuery + '%' };
    else whereArgs.date = { [Op.gte]: new Date(new Date()) }; // hide past

    // where status
    if(req.query.status && req.query.status !== '') whereArgs.status = req.query.status;

    // append where args
    qParams.where = whereArgs;

    [err, items] = await to(LiveGroupTraining.findAndCountAll(qParams));

    let items_json =[];
    let item_rows = items.rows;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();

        item_info.participants = item_info.participants.map((participant) => { return participant.id });
        items_json.push(item_info);
    }
    return ReS(res, {items: items_json, count: items.count});
}
module.exports.getAll = getAll;

const get = function(req, res){
    let item = req.item;

    return ReS(res, {item: item.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, item, data;
    let participants = req.participants;

    item = req.item;
    data = req.body;
    item.set(data);

    [err, participants] = await to(item.setParticipants(participants));
    if(err) return ReE(res, err);

    [err, item] = await to(item.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {item:item.toWeb()});
}
module.exports.update = update;

const start = async function(req, res){
    let err, item, data;
    item = req.item;
    data = req.body;
    item.set({
        started: data.dateStart
    });

    [err, item] = await to(item.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {item:item.toWeb()});
}
module.exports.start = start;

const close = async function(req, res){
    let err, item;
    item = req.item;
    item.set({
        status: 'close'
    });

    [err, item] = await to(item.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {item:item.toWeb()});
}
module.exports.close = close;

const remove = async function(req, res){
    let company, err;
    company = req.company;

    [err, company] = await to(company.destroy());
    if(err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, {message:'Deleted Company'}, 204);
}
module.exports.remove = remove;