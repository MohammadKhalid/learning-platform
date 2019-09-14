const { Sequelize, StudentExperienceSetting, User, Company } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const create = async function (req, res) {

    let { initialLevel, initialExperience, clientId, companyId } = req.body
    let studentExpSettings = []
    let check = await StudentExperienceSetting.findAll({
        where: {
            clientId: clientId,
            companyId: companyId
        }
    })
    if (check.length == 0) {
        studentExpSettings = await StudentExperienceSetting.create({
            initialLevel: initialLevel,
            initialExperience: initialExperience,
            clientId: clientId,
            companyId: companyId

        })
    } else {
        studentExpSettings = await StudentExperienceSetting.update({
            initialLevel: initialLevel,
            initialExperience: initialExperience,
        }, {
                where: {
                    clientId: clientId,
                    companyId: companyId
                }
            })
    }

    if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
    else return ReE(res, { message: 'Unable to insert settings.' }, 500)

}
module.exports.create = create;


const update = async (req, res) => {
    let { itemId } = req.params
    let { initialLevel, initialExperience } = req.body

    const studentExpSettings = await StudentExperienceSetting.update({
        initialLevel: initialLevel,
        initialExperience: initialExperience
    }, {
            where: {
                id: itemId
            }
        })
    if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
    else return ReE(res, { message: 'Unable to update settings.' }, 500)
}

module.exports.update = update;


const get = async function (req, res) {
    let { itemId } = req.params
    const studentExpSettings = await StudentExperienceSetting.findAll({
        where: {
            id: itemId
        },
        include: [
            {
                model: User,
                as: 'client',
                attributes: [[Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']]
            },
            {
                model: Company,
                as: 'company',
                attributes: ['name']
            }
        ]
    })

    if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
    else return ReE(res, { message: 'Unable to get settings.' }, 500)
}
module.exports.get = get;

const getAll = async function (req, res) {
    let { userId } = req.params
    const studentExpSettings = await StudentExperienceSetting.findAll({
        where: {
            clientId: userId
        },
        include: [{
            model: User,
            as: "client",
            attributes: [['id', 'userId'], 'firstName', 'lastName']

        },
        {
            model: Company,
            as: "company",
            attributes: [['id', 'companyId'], 'name']

        }],
    })
    if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
    else return ReE(res, { message: 'Unable to get settings.' }, 500)
}
module.exports.getAll = getAll;
