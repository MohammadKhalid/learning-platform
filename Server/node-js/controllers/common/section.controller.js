const { Sequelize, CourseCategory, Section, Text, Lesson, Course, StudentProgress } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;


const getCoachSections = async (req, res) => {
    let { courseId } = req.params
    const section = await Section.findAll({
        attributes: ['id', 'title', 'description', 'totalExperience'],
        include: [{
            model: Course,
            as: "course",
            attributes: [['id', 'courseId'], 'title', 'description']
        }],
        where: {
            courseId: courseId
        }
    })
    if (section) return ReS(res, { data: section }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

const getLastSectionDetails = async (req, res) => {
    let section = [];
    let { studentId } = req.params
    const studentProgress = await StudentProgress.findAll({
        attributes: ['lastSectionId'],

        where: {
            studentId: studentId
        }
    })

    if (studentProgress.length > 0) {
        section = await Section.findAll({

            where: {
                id: studentProgress[0].lastSectionId
            }
        })
    }

    if (section) return ReS(res, { data: section }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.getCoachSections = getCoachSections;
