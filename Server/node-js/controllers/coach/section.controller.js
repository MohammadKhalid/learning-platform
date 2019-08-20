const { Section, Course } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const create = async (req, res) => {
    let { title, description, totalExperience, courseId } = req.body
    const section = await Section.create({
        title: title,
        description: description,
        totalExperience: totalExperience,
        courseId: courseId,
    })
    if (section) return ReS(res, { data: section }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.create = create;

const removeSection = async (req, res) => {
    let { sectionId } = req.params
    const section = await Section.destroy({
        where: {
            id: sectionId
        }
    })
    if (section) return ReS(res, { data: section }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.removeSection = removeSection;

const updateSection = async (req, res) => {
    let { sectionId } = req.params
    let { title, description, totalExperience } = req.body
    const sectionUpdate = await Section.update({
        title: title,
        description: description,
        totalExperience: totalExperience,
    }, {
        where: {
            id: sectionId
        }
    })

    const section = await Section.findAll({
        where:{
            id: sectionId
        }
    })
    if (section) return ReS(res, { data: section.pop() }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.updateSection = updateSection;