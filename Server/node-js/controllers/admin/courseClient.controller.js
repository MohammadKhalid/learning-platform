const { Sequelize, User, Company } = require('../../models');
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
    let { clientId } = req.params
    const company = await User.findAll({
        include: [{
            model: Company,
            attributes: ['id','name'],
            as: 'companies',
        }],
        where: {
            id: clientId
        }

    })
    if (company.length > 0) return ReS(res, { data: company.pop() }, 200);
    else return ReE(res, { message: 'Unable to get companies.' }, 500)
}
module.exports.getClientCompany = getClientCompany;
