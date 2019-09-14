const { SubscriptionPackage } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

// const create = async function(req, res){
//     let err, company;
//     let user = req.user;

//     let company_info = req.body;


//     [err, company] = await to(Company.create(company_info));
//     if(err) return ReE(res, err, 422);

//     company.addUser(user, { through: { status: 'started' }})

//     [err, company] = await to(company.save());
//     if(err) return ReE(res, err, 422);

//     let company_json = company.toWeb();
//     company_json.users = [{user:user.id}];

//     return ReS(res, {company:company_json}, 201);
// }
// module.exports.create = create;

const getAll = async function(req, res){
    let err, items;

    // start query
    [err, items] = await to(SubscriptionPackage.findAndCountAll());

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

// const get = function(req, res){
//     let company = req.company;

//     return ReS(res, {company:company.toWeb()});
// }
// module.exports.get = get;

// const update = async function(req, res){
//     let err, company, data;
//     company = req.company;
//     data = req.body;
//     company.set(data);

//     [err, company] = await to(company.save());
//     if(err){
//         return ReE(res, err);
//     }
//     return ReS(res, {company:company.toWeb()});
// }
// module.exports.update = update;

// const remove = async function(req, res){
//     let company, err;
//     company = req.company;

//     [err, company] = await to(company.destroy());
//     if(err) return ReE(res, 'error occured trying to delete the company');

//     return ReS(res, {message:'Deleted Company'}, 204);
// }
// module.exports.remove = remove;