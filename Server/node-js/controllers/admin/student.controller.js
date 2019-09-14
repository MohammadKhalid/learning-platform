const { User, Company, DepartmentTag } = require('../../models');
const userService       = require('../../services/user.service');
const { to, ReE, ReS }  = require('../../services/util.service');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, newUser, user;
    let body = req.body;
    let loggedUser = req.user.toJSON();
    
    // load client
    [err, user] = await to(User.findByPk(body.clientId));
    if(err) return ReE(res, err);
    if(!user) return ReE(res, 'Not found!');

    // set user type
    body.type = 'student';

    if(!body.username) {
        return ReE(res, 'Please enter a username.');
    // Require Email
    // } else if(!body.email) {
    //     return ReE(res, 'Please enter an email.');
    // } 
    } else if(!body.password){
        return ReE(res, 'Please enter a password.');
    } else {
        // build ids
        let companyDepartmentIds = {};
        body.departments.forEach((department) => {
            const idsArray = department.split('-');

            const companyId = idsArray[0];
            const departmentId = idsArray[1];

            if(companyDepartmentIds[companyId]) companyDepartmentIds[companyId].push(departmentId);
            else companyDepartmentIds[companyId] = [departmentId];
        });

        // get selected companies
        let companies;
        [err, companies] = await to(user.getCompanies({
            where: {
                id: { [Op.in]: body.companies }
            }
        }));
        if(err) return ReE(res, err);
        if(!companies || companies.length < 1) 
        return ReE(res, 'Please select user companies.');

        // get departments each selected companies
        let companyDepartments = {};

        [err, companies] = await to(new Promise((resolve, reject) => {
            companies.forEach(async (company, index, array) => {
                if(!companyDepartmentIds[company.id] || companyDepartmentIds[company.id].length < 1)
                    return reject({message: 'Please select ' + company.name + ' departments!'});

                let departments;
                [err, departments] = await to(company.getDepartments({
                    where: {
                        id: { [Op.in]: companyDepartmentIds[company.id] }
                    }
                }));
    
                // validate departments each company
                if(err || !departments || departments.length < 1) return reject({message: 'Please select ' + company.name + ' department.'});
    
                // set departments
                company.departments = departments;
                // companyDepartments[company.id] = departments;

                // all done
                if (index === array.length - 1) return resolve(companies);
            });
        }));
        if(err) return ReE(res, err);

        // create user
        [err, newUser] = await to(userService.create(loggedUser, body));
        if(err) return ReE(res, err, 422);

        // save companies
        [err, companies] = await to(new Promise((resolve, reject) => {
            companies.forEach(async (company, index, array) => {
                let assignedCompany;
                [err, assignedCompany] = await to(newUser.addCompany(company));
                if(err) return ReE(res, err, 422);
                
                // set
                assignedCompany = assignedCompany[0];

                if(assignedCompany && company.departments.length > 0) {
                    let assignedCompanyDepartments;
                    [err, assignedCompanyDepartments] = await to(assignedCompany.addDepartments(company.departments));
                    if(err) reject('Error adding assinged company departments!');
                }

                // all done
                if (index === array.length - 1) resolve(companies);
            });
        }));
        if(err) return ReE(res, err);
    }

    return ReS(res, { id: newUser.id, message: body.firstName + ' ' + body.lastName + ' has been added.' }, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let err, items;
    let req_query = req.query;

    // query args
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;

    let qParams = {
        where: {
            type: 'student',
            isActive: true
        },
        include: [
            {
                association: 'assignedCompanies',
                include: 'company'
            }
        ],
        attributes: ['id', 'firstName', 'lastName'],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage
    };

    // status
    if(req_query.isActive) qParams.where.isActive = req_query.isActive;

    // deleted
    if(req_query.isDeleted) qParams.where.isDeleted = req_query.isDeleted;

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
    
    // // load client
    // [err, user] = await to(User.findByPk(item_info.clientId));
    // if(err) return ReE(res, err);
    // if(!user) return ReE(res, 'Not found!');

    // // get items with in companies
    // let companies;
    // [errr, companies] = await to(user.getCompanies());
    // if(err) return ReE(res, err);

    // // build ids
    // let companyIds = companies.map((row) => { return row.id});

    [err, item] = await to(User.findByPk(item_id, {
        include: [
            {
                association: 'assignedCompanies',
                include: [
                    {
                        association: 'company'
                    },
                    {
                        association: 'departments'
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding student");
    if(!item) return ReE(res, "Student not found!");

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
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(User.findByPk(item_id, {
        include: [
            {
                association: 'assignedCompanies'
            }
        ]
    }));
    if(err) return ReE(res, "err finding student");
    if(!item) return ReE(res, "Student not found!");

    // remove assigned companies
    item.assignedCompanies.forEach(async (assignedCompany) => {
        await to(assignedCompany.setDepartments([]));
        await to(assignedCompany.destroy());
    });
    await to(item.setAssignedCompanies([]));

    // remove other association
    await to(item.setProfiles([]));
    await to(item.setAddresses([]));
    await to(item.setTelecoms([]));
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
    let err, clients_with_companies, data = {};

    [err, clients_with_companies] = await to(User.findAll({
        where: {
            type: 'client',
            isActive: true,
            isDeleted: false
        },
        attributes: [
            'id',
            [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']
        ],
        include: [
            {
                association: 'companies',
                attributes: ['id', 'name'],
                include: [
                    {
                        association: 'departments',
                        attributes: ['id', 'name']
                    }
                ]
            }
        ]
    }));

    let clients_with_companies_json =[]
    for( let i in clients_with_companies){
        let client_with_company = clients_with_companies[i];
        let client_with_company_info = client_with_company.toWeb();
        
        clients_with_companies_json.push(client_with_company_info);
    }
    data.clients_with_companies = clients_with_companies_json;

    return ReS(res, data);
}
module.exports.formInputData = formInputData;