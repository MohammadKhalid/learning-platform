const { Sequelize, Category, User, Company } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, item;
    let user = req.user;
    let item_info = req.body;

    // admin share categ by default
    if(!item_info.isPublic) item_info.isPublic = true;

    // create
    [err, item] = await to(user.createCategory(item_info));
    if(err) return ReE(res, err, 422);

    let item_json = item.toWeb();

    // tag companies
    for (let index_ = 0; index_ < item_info.clients.length; index_++) {
        let client = item_info.clients[index_];
        let companies = client.companies;

        for (let index = 0; index < companies.length; index++) {
            const company = companies[index];

            if(company.checked) {
                let userCompanies;
                
                [err, userCompanies] = await to(Company.findAll({ where: { id: company.id } }));
                if(err) return ReE(res, err, 422);

                [err, userCompanies] = await to(item.addCompanies(userCompanies));
                if(err) return ReE(res, err, 422);
            }
        }
    }

    // add parent categories
    if(item_info.parents && item_info.parents.length > 0) {
        let parents;
        [err, parents] = await to(user.getCategories({ where: { id: { [Op.in]: item_info.parents } } }));
        if(err) return ReE(res, err);

        [err, item] = await to(item.addParents(parents));
        if(err) return ReE(res, err);
    }

    return ReS(res, {item:item_json}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let err, items;
    let user = req.user;

    // query args
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;

    let whereArgs = {};
    let qParams = {
        include: [
            {
                association: 'parents',
                attributes: ['id', 'title']
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

    // start query
    [err, items] = await to(user.getCategories(qParams));
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
    let item_id, err, item;
        item_id = req.params.item_id || req.body.id;

    [err, item] = await to(Category.findByPk(item_id, {
        include: [
            {
                association: 'parents',
                attributes: ['id', 'title']
            },
            {
                association: 'companies',
                attributes: ['id', 'name']
            }
        ]
    }));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);

    return ReS(res, {item:item.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let item_id, err, item, data;

    user = req.user;
    item_id = req.params.item_id || req.body.id;

    data = req.body;
    data.updatedBy = user.id;

    [err, item] = await to(Category.findByPk(item_id));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);

    item.set(data);
    [err, item] = await to(item.save());
    if(err) return ReE(res, err);

    let item_json = item.toWeb();

    if(data.parents && data.parents.length > 0) {
        let parents;
        [err, parents] = await to(user.getCategories({ where: { id: { [Op.in]: data.parents } } }));
        if(err) return ReE(res, err);

        [err, item] = await to(item.setParents(parents));
        if(err) return ReE(res, err);
    }

    // tag companies
    for (let index_ = 0; index_ < item_info.clients.length; index_++) {
        let client = item_info.clients[index_];
        let companies = client.companies;

        for (let index = 0; index < companies.length; index++) {
            const company = companies[index];

            if(company.checked) {
                let userCompanies;
                
                [err, userCompanies] = await to(Company.findAll({ where: { id: company.id } }));
                if(err) return ReE(res, err, 422);

                [err, userCompanies] = await to(item.addCompanies(userCompanies));
                if(err) return ReE(res, err, 422);
            }
        }
    }

    return ReS(res, { item: item_json });
}
module.exports.update = update;

const remove = async function(req, res){
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id || req.body.id;

    [err, item] = await to(Category.findByPk(item_id));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);

    [err, item] = item.createdBy === user.id ? await to(item.destroy()) : await to(user.removeCategory(item));
    if(err) return ReE(res, 'error occured trying to delete the item');

    return ReS(res, { success: true, message:'Deleted!' });
}
module.exports.remove = remove;

const formInputData = async function(req, res){
    let err;
    let user = req.user;
    let data = {};

    [err, data.categories] = await to(user.getCategories());
    if(err) return ReE(res, err);

    [err, data.clients] = await to(User.findAll({ 
        where: { type: 'client' },
        attributes: [ 'id', 'firstName', 'lastName' ],
        include: [
            {
                association: 'companies',
                attributes: [ 'id', 'name' ],
                include: [
                    {
                        association: 'departments',
                        attributes: [ 'id', 'name' ],
                        required: false,
                        include: [
                            {
                                association: 'users',
                                attributes: [ 'id', 'firstName', 'lastName', 'type' ],
                                where: { type: { [Op.or]: ['student', 'coach'] }  },
                                required: false
                            }
                        ]
                    },
                    {
                        association: 'users',
                        attributes: [ 'id', 'firstName', 'lastName', 'type' ],
                        where: { type: { [Op.or]: ['student', 'coach'] }  },
                        required: false
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, err);

    return ReS(res, data);
}
module.exports.formInputData = formInputData;