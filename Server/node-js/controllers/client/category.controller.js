const { Sequelize, Category, User } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, item, item_json;
    let user = req.user;
    let item_info = req.body;

    // create
    [err, item] = await to(user.createCategory(item_info));
    if(err) return ReE(res, err, 422);

    // set response
    item_json = item.toWeb();

    // tag companies
    for (let index = 0; index < item_info.companies.length; index++) {
        const company = item_info.companies[index];
        
        if(company.checked) {
            let userCompanies;
            
            [err, userCompanies] = await to(user.getCompanies({ where: { id: company.id } }));
            if(err) return ReE(res, err, 422);

            [err, userCompanies] = await to(item.addCompanies(userCompanies));
            if(err) return ReE(res, err, 422);
        }
    }

    // add parent categories
    if(item_info.parents && item_info.parents.length > 0) {
        let parents;
        [err, parents] = await to(user.getCategories({ where: { id: { [Op.in]: item_info.parents } } }));
        if(err) return ReE(res, err);

        [err, item.parents] = await to(item.addParents(parents));
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
    let user = req.user;
    let item_id, err, item;
        item_id = req.params.item_id || req.body.id;

    [err, item] = await to(user.getCategories({ 
        where: { id: item_id },
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
    if(!item || item.length < 0) return ReE(res, "not found");

    // set item
    item = item[0];

    let item_json = item.toWeb();

    return ReS(res, {item: item_json});
}
module.exports.get = get;

const update = async function(req, res){
    let item_id, err, item, item_info, companies;

    user = req.user;
    item_id = req.params.item_id || req.body.id;

    item_info = req.body;
    item_info.updatedBy = user.id;

    [err, item] = await to(user.getCategories({ where: { id: item_id } }));
    if(err) return ReE(res, "err finding");
    if(!item || item.length < 0) return ReE(res, "not found");

    // set item
    item = item[0];

    item.set(item_info);
    [err, item] = await to(item.save());
    if(err) return ReE(res, err);

    let item_json = item.toWeb();

    // parents
    if(item_info.parents && item_info.parents.length > 0) {
        let parents;
        [err, parents] = await to(user.getCategories({ where: { id: { [Op.in]: item_info.parents } } }));
        if(err) return ReE(res, err);

        [err, parents] = await to(item.setParents(parents));
        if(err) return ReE(res, err);
    }

    // set companies
    [err, companies] = await to(item.setCompanies([]));
    if(err) return ReE(res, err);    

    for (let index = 0; index < item_info.companies.length; index++) {
        let company = item_info.companies[index];

        if(company.checked) {
            let userCompany;
            [err, userCompany] = await to(user.getCompanies({ where: { id: company.id } }));
            if(err) return ReE(res, err);

            [err, company] = await to(item.addCompanies(userCompany));
            if(err) return ReE(res, err);
        }
    }

    return ReS(res, { item: item_json });
}
module.exports.update = update;

const remove = async function(req, res){
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id || req.body.id;

    [err, item] = await to(user.getCategories({ where: { id: item_id } }));
    if(err) return ReE(res, "err finding");
    if(!item || item.length < 0) return ReE(res, "not found");

    // set item
    item = item[0];

    // remove associations
    await to(item.setUsers([]));
    await to(item.setCompanies([]));
    await to(item.setTopics([]));
    await to(item.setParents([]));

    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'error occured trying to delete the item');

    return ReS(res, { success: true, message:'Deleted!' });
}
module.exports.remove = remove;

const formInputData = async function(req, res){
    let err;
    let user = req.user;
    let data = {};

    // @TODO. filter parent categories
    [err, data.categories] = await to(user.getCategories({ through: { taggable: 'category' } }));
    if(err) return ReE(res, err);

    [err, data.companies] = await to(user.getCompanies({ 
        attributes: [ 'id', 'name' ],
        include: [
            {
                association: 'departments',
                attributes: [ 'id', 'name' ]
            }
        ]
    }));
    if(err) return ReE(res, err);

    return ReS(res, data);
}
module.exports.formInputData = formInputData;

const getTemplate = async function(req, res){
    let err, items, userCategories, categoryIds;
    let user = req.user;

    // current user categories
    [err, userCategories] = await to(user.getCategories({attributes: ['id'], raw : true}));
    if(err) return ReE(res, err);

    // extract ids
    categoryIds = await userCategories.map((userCategory) => userCategory.id);
    
    [err, items] = await to(Category.findAll({ 
        where: {
            id: { [Op.notIn]: categoryIds }, 
            isPublic: true
        }
    }));
    if(err) return ReE(res, err);

    return ReS(res, { items: items });
}
module.exports.getTemplate = getTemplate;

const importTemplate = async function(req, res){
    let err, items, templateItems;
    let user = req.user;
    let ids = req.body.ids;

    // template
    if(ids && ids.length > 0) {
        [err, templateItems] = await to(Category.findAll({ 
            where: { 
                id: { [Op.in]: ids },
                isPublic: true 
            }
        }));
        if(err) return ReE(res, err);

        [err, items] = await to(user.addCategories(templateItems));
        if(err) return ReE(res, err);
    }

    let items_json = [];
    let item_rows = templateItems;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }

    return ReS(res, {items: items_json});
}
module.exports.importTemplate = importTemplate;