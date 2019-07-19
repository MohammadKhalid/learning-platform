const { LiveGroupTraining, Sequelize, User } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

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
                association: 'users',
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

    [err, items] = await to(user.getLiveGroupTrainings(qParams));

    let items_json =[];
    let item_rows = items;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();

        item_info.participants = item_info.users.map((participant) => { return participant.id });
        items_json.push(item_info);
    }
    return ReS(res, {items: items_json, count: items.count});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id;

    [err, item] = await to(user.getLiveGroupTrainings({
        where: { id: item_id },
        include: [
            { 
                association: 'speaker',
                attributes: { 
                    exclude: ['password', 'username']
                }
            },
            { 
                association: 'users',
                attributes: { 
                    exclude: ['password', 'username']
                }
            }
        ]
    }));
    if(err) return ReE(res, "err finding topic");
    if(!item || item.length < 1) return ReE(res, "Topic not found!");

    // item
    item = item[0];

    // response
    let item_json = item.toWeb();

    // set participant
    // fix view undefined var
    item_json.participants = item_json.users;

    return ReS(res, {item: item_json});
}
module.exports.get = get;