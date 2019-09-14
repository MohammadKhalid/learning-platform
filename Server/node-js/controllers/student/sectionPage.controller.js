const { Section, Course, SectionPage } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



const getSectionPages = async (req, res) => {
    let sectionIds;
    let { courseId } = req.params;

    let section = await Section.findAll({
        where: {
            courseId: courseId
        }
    })

    sectionIds = section.map((row) => row.id);

    let sectionPage = await SectionPage.findAll({
        where: {
            sectionId: {
                [Op.in]: sectionIds
            }
        }
    })

    

    if (section) return ReS(res, { section: section, sectionPage: sectionPage }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.getSectionPages = getSectionPages;