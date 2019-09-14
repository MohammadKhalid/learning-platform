const { Sequelize, User } = require('../../models');
const { to, ReE, ReS }  = require('../../services/util.service');
const Op = Sequelize.Op;

const getAll = async function(req, res){
    let err, items, req_query, user;
    
    req_query = req.query;
    user = req.user;

    // query args
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;

    // get items with in companies
    let companies;
    [errr, companies] = await to(user.getCompanies());
    if(err) return ReE(res, err);

    // build ids
    let companyIds = companies.map((row) => { return row.id});

    let qParams = {
        where: {
            type: 'coach',
            isActive: true
        },
        include: [
            // { all: true }
            {
                association: 'assignedCompanies',
                where: {
                    companyId: { 
                        [Op.in]: companyIds 
                    }
                },
                include: 'company'
            }
        ],
        attributes: ['id', 'firstName', 'lastName'],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage
    };

    // search keyword
    if(req_query.searchQuery) qParams.where.firstName = { [Op.like]: req_query.searchQuery + '%' };

    [err, items] = await to(User.findAll(qParams));
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
    item_id = req.params.item_id;
    user = req.user;

    // get items with in companies
    let companies;
    [errr, companies] = await to(user.getCompanies());
    if(err) return ReE(res, err);

    // build ids
    let companyIds = companies.map((row) => { return row.id});

    [err, item] = await to(User.findByPk(item_id, {
        include: [
            // { all: true },
            // { all: true, nested: 'all' }
            {
                association: 'assignedCompanies',
                where: {
                    companyId: { 
                        [Op.in]: companyIds 
                    }
                },
                include: [
                    {
                        association: 'company'
                    },
                    {
                        association: 'departments'
                    }
                ]
            }
            // 'profiles',
            // 'addresses',
            // 'telecoms'
        ]
    }));
    if(err) return ReE(res, "err finding coach");
    if(!item) return ReE(res, "Coach not found!");

    // @TODO. validate permission
    // ...

    return ReS(res, {item: item.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    const user = req.user;

    let err;
    let item = req.item;
    let data = req.body;
    
    // set value
    item.set(data);

    // @TODO. update profile, address, telecom

    [err, item] = await to(item.save());
    if(err) return ReE(res, err);

    return ReS(res, {item:item.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let item_id, err, item, user;
    item_id = req.params.item_id;
    user = req.user;

    // get items with in companies
    let companies;
    [errr, companies] = await to(user.getCompanies());
    if(err) return ReE(res, err);

    // build ids
    let companyIds = companies.map((row) => { return row.id});

    [err, item] = await to(User.findByPk(item_id, {
        include: [
            {
                association: 'assignedCompanies',
                where: {
                    companyId: { 
                        [Op.in]: companyIds 
                    }
                },
                require: true
            }
        ]
    }));
    if(err) return ReE(res, "err finding coach");
    if(!item) return ReE(res, "Coach not found!");

    // remove assigned companies
    item.assignedCompanies.forEach(async (assignedCompany) => {
        await to(assignedCompany.setDepartments([]));
        await to(assignedCompany.destroy());
    });
    await to(item.setAssignedCompanies([]));

    // remove other association
    await to(item.setProfiles([]));
    await to(item.setAddresses([]));
    // ... more

    // delete
    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'error occured when trying to delete');

    // set value
    // item.set({isActive: false, isDeleted: true });

    // [err, item] = await to(item.save());
    // if(err) return ReE(res, 'error occured when trying to delete');

    return ReS(res, {message: item.firstName + ' ' + item.lastName + ' has been deleted!'});
}
module.exports.remove = remove;

const formInputData = async function(req, res){
    let err, companies, data = {};
    let user = req.user;

    [errr, companies] = await to(user.getCompanies({
        attributes: ['id', 'name'],
        include: [
            {
                association: 'departments',
                attributes: ['id', 'name']
            }
        ]
    }));
    if(err) return ReE(res, err);

    let companies_json =[]
    for( let i in companies){
        let company = companies[i];
        let company_info = company.toWeb();
        
        companies_json.push(company_info);
    }
    data.companies = companies_json;

    return ReS(res, data);
}
module.exports.formInputData = formInputData;