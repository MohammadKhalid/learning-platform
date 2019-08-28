const { Section, Course, SectionPage } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



const getSectionPages = async (req, res) => {
    let { courseId } = req.params;

    let section = await Section.findAll({

        include: [{
            model: SectionPage,
            as: "sectionPage",
        }],
        where: {
            courseId: courseId
        }
    })

    

    if (section) return ReS(res, { data: section }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.getSectionPages = getSectionPages;