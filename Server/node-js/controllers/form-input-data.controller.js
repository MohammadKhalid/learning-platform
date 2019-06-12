const { User, SubscriptionPackage, Company } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const Sequelize = require('sequelize');

const getAll = async function(req, res){
    let user = req.user;
    let err, coaches;
    let data = {};

    [err, coaches] = await to(User.findAll({
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

    return ReS(res, {data: data});
}
module.exports.getAll = getAll;

const getUserInputData = async function(req, res){
    let err;
    let user = req.user;
    let data = {};
    let allowUserTypes = ['admin', 'company'];

    if(allowUserTypes.includes(user.type)) {
        let userType = req.query.type;

        switch (userType) {
            case 'company':
                let subsription_packages;
                [err, subsription_packages] = await to(SubscriptionPackage.findAll());

                let subsription_packages_json = [];
                for(let i in subsription_packages){
                    let subsription_package = subsription_packages[i];
                    let subsription_package_info = subsription_package.toWeb();
                    
                    subsription_packages_json.push(subsription_package_info);
                }
                data.subsription_packages = subsription_packages_json;

                break;
            case 'student':
                let companies;
                [err, companies] = await to(Company.findAll());

                let companies_json = [];
                for(let i in companies){
                    let company = companies[i];
                    let company_info = company.toWeb();
                    
                    companies_json.push(company_info);
                }
                data.companies = companies_json;

                break;
            default:
                break;
        }
    }

    return ReS(res, {data: data});
}
module.exports.getUserInputData = getUserInputData;