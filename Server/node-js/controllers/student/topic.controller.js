const { Sequelize, Topic } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const getAll = async function(req, res){
    let err, items;
    let user = req.user;

    // assigned companies
    let assignedCompanies;
    [err, assignedCompanies] = await to(user.getAssignedCompanies());
    if(err) return ReE(res, err);

    let assignedCompanyIds = assignedCompanies.map((row) => { return row.companyId});

    // query args
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;

    let whereArgs = {};
    let qParams = {
        include: [
            {
                association: 'companies',
                where: {
                    id: { [Op.in]: assignedCompanyIds }
                }
            }
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage
    };

    // search keyword
    if(req.query.title) whereArgs.title = { [Op.substring]: req.query.title };

    // where status
    if(req.query.isActive) {
        if(whereArgs.isActive === 'true') whereArgs.isActive = true;
        else if(whereArgs.isActive === 'false')  whereArgs.isActive = false;
    } else whereArgs.isActive = true;

    // append q
    if(whereArgs) qParams.where = whereArgs;

    [err, items] = await to(Topic.findAll(qParams));
    if(err) return ReE(res, err);

    let items_json =[];
    let item_rows = items;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }
    
    return ReS(res, {items: items_json});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id;

    // assigned companies
    let assignedCompanies;
    [err, assignedCompanies] = await to(user.getAssignedCompanies());
    if(err) return ReE(res, err);

    let assignedCompanyIds = assignedCompanies.map((row) => { return row.companyId});
    
    [err, item] = await to(Topic.findByPk(item_id, {
        include: [ 
            {
                association: 'categories',
                attributes: ['id', 'title']
            },
            {
                association: 'companies',
                attributes: ['id', 'name'],
                where: {
                    id: { [Op.in]: assignedCompanyIds }
                }
            },
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
    }));
    if(err) return ReE(res, "err finding topic");
    if(!item) return ReE(res, "Topic not found!");

    return ReS(res, {item: item.toWeb()});
}
module.exports.get = get;