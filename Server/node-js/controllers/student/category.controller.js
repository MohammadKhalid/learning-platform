const { Sequelize, Category } = require('../../models');
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
                association: 'parents',
                attributes: ['id', 'title']
            },
            {
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
            },
            {
                association: 'companies',
                attributes: ['id', 'name'],
                where: {
                    id: { [Op.in]: assignedCompanyIds }
                }
            },
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

    // start query
    [err, items] = await to(Category.findAll(qParams));
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
    let user = req.user;
    let item_id, err, item;
        item_id = req.params.item_id || req.body.id;

    [err, item] = await to(Category.findByPk(item_id, { include: [ {
        association: 'parents',
        attributes: ['id', 'title']
    }]}));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);

    let item_json = item.toWeb();

    // validate if not the creator
    if(item_json.createdBy !== user.id) {
        [err, item] = await to(user.hasCategory(item));
        if(err || !item) return ReE(res, "not found with id: " + item_id);
    }

    return ReS(res, {item: item_json});
}
module.exports.get = get;