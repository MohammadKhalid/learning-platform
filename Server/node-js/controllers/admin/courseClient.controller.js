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
    if (flag == 'levelSettings') {
        if (company[0].companies.length > 0) {
            let companyIdMap = company[0].companies.map(x => x.id)
            let companyIds = await StudentExperienceSetting.findAll({
                where: {
                    companyId: companyIdMap
                }
            })
            for (let index = 0; index < companyIds.length; index++) {
                company = company[0].companies.filter((x) => x.id != companyIds[index].companyId)
            }
        } else {
            return ReS(res, { data: [] }, 200);
        }
    }
    if (company.length > 0) return ReS(res, { data: company }, 200);
    else return ReE(res, { message: 'Unable to get companies.', data: [] }, 500)
}
module.exports.getClientCompany = getClientCompany;
