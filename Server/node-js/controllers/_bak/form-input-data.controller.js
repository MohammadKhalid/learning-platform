const { User, SubscriptionPackage, Company } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const Sequelize = require('sequelize');

const getQuery = async function(req, res){
    let err, userCompanies;
    let user = req.user;
    let data = {};
    let req_query = req.query;

    if(req_query.fields) {
        // build company ids array
        [err, userCompanies] = await to(user.getCompanies());

        let userCompaniesIds = [];
        for( let i in userCompanies){
            userCompaniesIds.push(userCompanies[i].id);
        }

        // convert to array
        let req_query_fields = req_query.fields.split(',');

        // company
        if(req_query_fields.includes('company')) {
            let companies;
            [err, companies] = await to(Company.findAll());

            let companies_json = [];
            for(let i in companies){
                let company = companies[i];
                let company_info = company.toWeb();
                
                companies_json.push(company_info);
            }
            data.companies = companies_json;
        }

        // student
        if(req_query_fields.includes('student')) {
            let students;

            [err, students] = await to(User.scope({ method: [user.type + 'Users', userCompaniesIds]}).findAll({
                where: {
                    type: 'student',
                    isActive: true,
                    isDeleted: false
                },
                attributes: [
                    'id',
                    [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']
                ]
            }));
        
            let students_json =[]
            for( let i in students){
                let student = students[i];
                let student_info = student.toWeb();
                
                students_json.push(student_info);
            }
            data.students = students_json;
        }

        // coaches
        if(req_query_fields.includes('coach')) {
            let coaches;

            [err, coaches] = await to(User.scope({ method: [user.type + 'Users', userCompaniesIds]}).findAll({
                where: {
                    type: 'coach',
                    isActive: true,
                    isDeleted: false
                },
                attributes: [
                    'id',
                    [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']
                ]
            }));

            let coaches_json =[]
            for( let i in coaches){
                let coach = coaches[i];
                let coach_info = coach.toWeb();
                
                coaches_json.push(coach_info);
            }
            data.coaches = coaches_json;
        }

        // clients
        if(req_query_fields.includes('client')) {
            let clients;

            [err, clients] = await to(User.findAll({
                where: {
                    type: 'client',
                    isActive: true,
                    isDeleted: false
                },
                attributes: [
                    'id',
                    [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']
                ]
            }));

            let clients_json =[]
            for( let i in clients){
                let client = clients[i];
                let client_info = client.toWeb();
                
                clients_json.push(client_info);
            }
            data.clients = clients_json;
        }

        // clients + companies
        if(req_query_fields.includes('client_with_company')) {
            let clients_with_companies;

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
                include: [ 'companies' ]
            }));

            let clients_with_companies_json =[]
            for( let i in clients_with_companies){
                let client_with_company = clients_with_companies[i];
                let client_with_company_info = client_with_company.toWeb();
                
                clients_with_companies_json.push(client_with_company_info);
            }
            data.clients_with_companies = clients_with_companies_json;
        }

        // subscription package
        if(req_query_fields.includes('subsription_packages')) {
            let subsription_packages;

            [err, subsription_packages] = await to(SubscriptionPackage.findAll());

            let subsription_packages_json = [];
            for(let i in subsription_packages){
                let subsription_package = subsription_packages[i];
                let subsription_package_info = subsription_package.toWeb();
                
                subsription_packages_json.push(subsription_package_info);
            }
            data.subsription_packages = subsription_packages_json;
        }
    }

    return ReS(res, {data: data});
}
module.exports.getQuery = getQuery;

// const getUserInputData = async function(req, res){
//     let err;
//     let user = req.user;
//     let data = {};
//     let allowUserTypes = ['admin', 'company'];

//     if(allowUserTypes.includes(user.type)) {
//         let userType = req.query.type;

//         switch (userType) {
//             case 'company':
//                 let subsription_packages;
//                 [err, subsription_packages] = await to(SubscriptionPackage.findAll());

//                 let subsription_packages_json = [];
//                 for(let i in subsription_packages){
//                     let subsription_package = subsription_packages[i];
//                     let subsription_package_info = subsription_package.toWeb();
                    
//                     subsription_packages_json.push(subsription_package_info);
//                 }
//                 data.subsription_packages = subsription_packages_json;

//                 break;
//             case 'student':
//                 let companies;
//                 [err, companies] = await to(Company.findAll());

//                 let companies_json = [];
//                 for(let i in companies){
//                     let company = companies[i];
//                     let company_info = company.toWeb();
                    
//                     companies_json.push(company_info);
//                 }
//                 data.companies = companies_json;

//                 break;
//             default:
//                 break;
//         }
//     }

//     return ReS(res, {data: data});
// }
// module.exports.getUserInputData = getUserInputData;