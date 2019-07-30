const { Sequelize, CourseCategory, Section, Text, Lesson } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;
// const uuidv4 = require('uuid/v4')

const getAll = async function (req, res) {
    let { userId } = req.params;
    const categories = await CourseCategory.findAll({
        where: {
            createdBy: userId
        }
    })
    return ReS(res, { data: categories }, 200);
}
module.exports.getAll = getAll;

const sectionDetails = async (req, res) => {
    let { sectionId } = req.params
    const sectionDetail = await Section.findAll({
        attributes: [['id', 'sectionId'], 'title', 'description'],
        include: [{
            model: Text,
            as: 'Text'
        }, {
            model: Lesson,
            as: 'Lesson'
        }],
        where: {
            id: sectionId
        }
    })
    if(sectionDetail.length > 0){
        return ReS(res, { data: [...sectionDetail[0].Text,...sectionDetail[0].Lesson] }, 200);
    }else{
        return ReS(res, { data: [] }, 200);
    }

}
module.exports.sectionDetails = sectionDetails;