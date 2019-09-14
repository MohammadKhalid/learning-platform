const { Company } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, item;
    let user = req.user;
    let client = req.client;
    let item_info = req.body;

    // set owner id
    item_info.userId = user.id;

    [err, item] = await to(Company.create(item_info));
    if(err) return ReE(res, err, 422);

    item.addUser(client, { through: { isOwner: true }});

    [err, item] = await to(item.save());
    if(err) return ReE(res, err, 422);

    let item_json = item.toWeb();

    return ReS(res, {item: item_json}, 201);
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
        // include: [
        //     'users'
        // ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage,
        order: [['name', 'ASC']]
    };

    // search keyword
    if(req.query.searchQuery) whereArgs.name = { [Op.like]: '%' + req.query.searchQuery + '%' };

    // append where args
    qParams.where = whereArgs;

    [err, items] = req.user.type === 'admin' ? await to(Company.findAll(qParams)) : await to(user.getCompanies(qParams));

    let items_json =[]
    for( let i in items){
        let item = items[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }

    return ReS(res, {items: items_json});
}
module.exports.getAll = getAll;

const get = function(req, res){
    let company = req.company;

    return ReS(res, {company:company.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, company, data;
    company = req.company;
    data = req.body;
    company.set(data);

    [err, company] = await to(company.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {company:company.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let company, err;
    company = req.company;

    [err, company] = await to(company.destroy());
    if(err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, {message:'Deleted Company'}, 204);
}
module.exports.remove = remove;