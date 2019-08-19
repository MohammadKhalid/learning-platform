const { Sequelize, CourseCategory, Section, Text, Lesson, Resource, Quiz, Course, SectionPage, StudentProgress } = require('../../models');
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
    const quizDetail = await Quiz.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })
    const resourceDetails = await Resource.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })
    if (sectionDetail.length > 0) {
        return ReS(res, { concept: [...sectionDetail[0].Text, ...sectionDetail[0].Lesson, ...quizDetail], resource: resourceDetails }, 200);
    } else {
        return ReS(res, { data: [] }, 200);
    }

}
module.exports.sectionDetails = sectionDetails;


const sectionDetailsForStudent = async (req, res) => {
    let { sectionId } = req.params
    const sectionDetailForStudent = await Section.findAll({
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
    const quizDetail = await Quiz.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })

    const resourceDetail = await Resource.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })
    if (sectionDetailForStudent.length > 0) {
        return ReS(res, { concept: [...sectionDetailForStudent[0].Text, ...sectionDetailForStudent[0].Lesson, ...quizDetail], resource: [...resourceDetail] }, 200);
    } else {
        return ReS(res, { data: [] }, 200);
    }

}
module.exports.sectionDetailsForStudent = sectionDetailsForStudent;


const getSections = async (req, res) => {
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
module.exports.getSections = getSections;


const getSideMenuItems = async (req, res) => {
    let { sectionId } = req.params
    const sectionpage = await SectionPage.findAll({
        where: {
            sectionId: sectionId
        }
    })
    const resources = await Resource.findAll({
        where: {
            sectionPageId: sectionId
        }
    })
    if (sectionpage) return ReS(res, { concept: sectionpage, resource: resources }, 200);
    else return ReE(res, { message: 'Unable to get Section Page.' }, 500)
}
module.exports.getSideMenuItems = getSideMenuItems;

const getSectionItems = async (req, res) => {
    let { sectionPageId, studentId } = req.params
    const sectionpage = await SectionPage.findAll({
        include: [{
            model: Lesson,
            as: 'Lesson'
        }, {
            model: Text,
            as: 'Text'
        }, {
            model: Quiz,
            as: 'Quiz'
        }],
        where: {
            id: sectionPageId
        }
    })


    

    if (req.user.type == "student") {
        console.log(req.user.type);
        const studentProgress = await StudentProgress.create({
            studentId: studentId,
            sectionPageId: sectionPageId
        })
    }

    if (sectionpage) return ReS(res, { data: sectionpage }, 200);
    else return ReE(res, { message: 'Unable to get Section Page.' }, 500)
}
module.exports.getSectionItems = getSectionItems;