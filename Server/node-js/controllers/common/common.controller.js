const { Sequelize, CourseCategory, UserCompany, Section, Text, Lesson, Resource, Quiz, Course, SectionPage, StudentProgress } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;
// const uuidv4 = require('uuid/v4')

const getAllCourse = async function (req, res) {
    let { userId } = req.params;
    const company = await UserCompany.findAll({
        attributes: ['companyId'],
        where: {
            userId: userId
        }
    })
    let userCompanyId = company[0].companyId
    const categories = await CourseCategory.findAll({
        where: {
            companyId: userCompanyId
        }
    })
    return ReS(res, { data: categories }, 200);
}
module.exports.getAllCourse = getAllCourse;

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
    let flag = 'Section'
    let section = await Section.findAll({
        attributes: ['id', 'title', 'description', 'totalExperience', 'courseId'],
        include: [{
            model: Course,
            as: "course",
            attributes: [['id', 'courseId'], 'title', 'description']
        }],
        where: {
            courseId: courseId
        }
    })
    if (section.length == 0) {
        flag = 'Course'
        section = await Course.findAll({
            where: {
                id: courseId
            }
        })
    }
    if (section) return ReS(res, { data: section, flag: flag }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.getSections = getSections;


const getSideMenuItems = async (req, res) => {
    let { sectionId } = req.params
    const sectionpage = await Section.findAll({
        attributes: ['title'],
        include: [{
            model: SectionPage,
            as: 'sectionPage'
        }],
        where: {
            id: sectionId
        }
    })
    const resources = await Resource.findAll({
        where: {
            sectionId: sectionId
        }
    })
    let concepts = sectionpage.pop();
    if (concepts.sectionPage) return ReS(res, { concept: concepts.sectionPage, title: concepts.title, resource: resources }, 200);
    else return ReE(res, { concept: concepts, title: concepts.title }, 500)
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
    if (sectionpage) return ReS(res, { data: [...sectionpage[0].Lesson, ...sectionpage[0].Text, ...sectionpage[0].Quiz] }, 200);
    else return ReE(res, { message: 'Unable to get Section Page.' }, 500)
}
module.exports.getSectionItems = getSectionItems;