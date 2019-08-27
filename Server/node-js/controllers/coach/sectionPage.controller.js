const { Section, Course, SectionPage } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const create = async (req, res) => {
    let { title, sectionId } = req.body
    const sectionpage = await SectionPage.create({
        title: title,
        sectionId: sectionId
    })
    if (sectionpage) return ReS(res, { data: sectionpage }, 200);
    else return ReE(res, { message: 'Unable to insert Section Page.' }, 500)
}
module.exports.create = create;

const removeSectionPage = async (req, res) => {
    let { sectionPageId } = req.params
    const sectionpage = await SectionPage.destroy({
        where: {
            id: sectionPageId
        }
    })
    if (sectionpage) return ReS(res, { data: sectionpage }, 200);
    else return ReE(res, { message: 'Unable to delete ' }, 500)
}
module.exports.removeSectionPage = removeSectionPage;

const updateSectionPage = async (req, res) => {
    let { sectionPageId } = req.params
    let { title } = req.body
    const course = await SectionPage.update({
        title: title,
    }, {
            where: {
                id: sectionPageId
            }
        })

    let sectionPage = await SectionPage.findAll({
        where:{
            id: sectionPageId
        }
    })
    if (sectionPage) return ReS(res, { data: sectionPage }, 200);
    else return ReE(res, { data: [], message: 'Unable to insert Course.' }, 500)
}
module.exports.updateSectionPage = updateSectionPage;