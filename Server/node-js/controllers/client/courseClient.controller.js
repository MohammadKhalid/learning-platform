const { Sequelize, User, Company, CourseCategory, StudentExperienceSetting } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const getClients = async function (req, res) {
    const clients = await User.findAll({
        attributes: ['id', [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']],
        where: {
            type: 'client'
        }
    })
    if (clients) return ReS(res, { data: clients }, 200);
    else return ReE(res, { message: 'Unable to get Client.' }, 500)
}
module.exports.getClients = getClients;


const getClientCompany = async function (req, res) {
    let { clientId, flag } = req.params

    let company = await User.findAll({
        include: [{
            model: Company,
            attributes: ['id', 'name'],
            as: 'companies',
        }],
        where: {
            id: clientId
        }
    })
    // if (flag == 'levelSettings') {
    //     if (company[0].companies.length > 0) {
    //         let companyIdMap = company[0].companies.map(x => x.id)
    //         let companyIds = await StudentExperienceSetting.findAll({
    //             where: {
    //                 companyId: companyIdMap
    //             }
    //         })
    //         if (companyIds.length > 0) {
    //             company = companyIds.map((x) => {
    //                 let arr = []
    //                 for (let index = 0; index < company[0].companies.length; index++) {
    //                     const element = companyIds[index];
    //                     if (x.companyId != element.id) {
    //                         arr.push({
    //                             id: element.id,
    //                             name: element.name
    //                         })
    //                     }
    //                 }
    //                 return arr
    //             })
    //             console.log(company)
    //             if (company.length > 0) return ReS(res, { data: company }, 200);
    //             else return ReE(res, { message: 'Unable to get companies.', data: [] }, 500)
    //         } else {
    //             if (company.length > 0) return ReS(res, { data: company[0].companies }, 200);
    //             else return ReE(res, { message: 'Unable to get companies.', data: [] }, 500)
    //         }

    //     } else {
    //         return ReS(res, { data: [] }, 200);
    //     }
    // }
    if (company.length > 0) return ReS(res, { data: company }, 200);
    else return ReE(res, { message: 'Unable to get companies.', data: [] }, 500)

}
module.exports.getClientCompany = getClientCompany;
