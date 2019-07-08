const { StudentExperienceSettings } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function (req, res) {

    let { initialLevel, initialExperience, adminId } = req.body
    const allStudentExpSettings = await StudentExperienceSettings.findAll({
        where: {
            adminId: adminId
        }
    })

    if (allStudentExpSettings.length == 0) {
        const studentExpSettings = await StudentExperienceSettings.create({
            initialLevel: initialLevel,
            initialExperience: initialExperience,
            adminId: adminId
        })

        if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
        else return ReE(res, { message: 'Unable to insert settings.' }, 500)
    }
    else {

        const studentExpSettings = await StudentExperienceSettings.update({
            initialLevel: initialLevel,
            initialExperience: initialExperience,
            adminId: adminId
        }, {
                where: {
                    adminId: adminId
                }
            })
        if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
        else return ReE(res, { message: 'Unable to update settings.' }, 500)

    }



}
module.exports.create = create;

const get = async function (req, res) {
    let { adminId } = req.params
    const studentExpSettings = await StudentExperienceSettings.findAll({
        where: {
            adminId: adminId
        }
    })

    if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
    else return ReE(res, { message: 'Unable to get settings.' }, 500)
}
module.exports.get = get;



const update = async function (req, res) {
    let { initialLevel, initialExperience, adminId } = req.body
    let { studentExpSettingsId } = req.params
    const studentExpSettings = await StudentExperienceSettings.update({
        initialLevel: initialLevel,
        initialExperience: initialExperience,
        adminId: adminId
    }, {
            where: {
                id: studentExpSettingsId
            }
        })
    if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
    else return ReE(res, { message: 'Unable to update settings.' }, 500)
}
module.exports.update = update;

const remove = async (req, res) => {
    let { studentExpSettingsId } = req.params
    const studentExpSettings = await StudentExperienceSettings.destroy({
        where: {
            id: studentExpSettingsId
        }
    })
    if (studentExpSettings) return ReS(res, { data: studentExpSettings }, 200);
    else return ReE(res, { message: 'Unable to insert settings.' }, 500)
}
module.exports.remove = remove;
