const { Category } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, item;
    let user = req.user;

    let item_info = req.body;

    [err, item] = await to(Category.create(item_info));
    if(err) return ReE(res, err, 422);

    let item_json = item.toWeb();
    item_json.users = [{user:user.id}];

    return ReS(res, {item:item_json}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;

    // exclude private flag
    let topic_association = {
        association: 'topics',
        include: [
            {
                association: 'questions',
                include: [
                    {
                        association: 'question',
                        include: [ 'medias' ]
                    }
                ]
            }
        ]
    };

    if(user.type !== 'admin') topic_association.where = { isPrivate: false };

    let qParams = {
        include: [
            topic_association
        ]
    };

    // pagi
    if(req.query.pageNumber && req.query.limit) {
        qParams.offset = parseInt(req.query.pageNumber);
        qParams.limit = parseInt(req.query.limit);
    }

    let whereArgs = {};

    // search keyword
    if(req.query.title) whereArgs.title = { [Op.like]: req.query.title + '%' };

    // where status
    if(req.query.isActive) {
        if(whereArgs.isActive === 'true') whereArgs.isActive = true;
        else if(whereArgs.isActive === 'false')  whereArgs.isActive = false;
    } else whereArgs.isActive = true;

    // append q
    if(whereArgs) qParams.where = whereArgs;

    // start query
    [err, items] = await to(Category.findAndCountAll(qParams));

    let items_json =[];
    let item_rows = items.rows;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }
    return ReS(res, {items: items_json, count: items_json.count});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item = req.item;

    return ReS(res, {item:item.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, item, data;
    item = req.item;
    data = req.body;

    item.set(data);

    [err, item] = await to(item.save());
    if(err) return ReE(res, err);

    return ReS(res, {item:item.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let item, err;
    item = req.item;

    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'error occured trying to delete the item');

    return ReS(res, { success: true, message:'Deleted!' });
}
module.exports.remove = remove;