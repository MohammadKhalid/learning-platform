const { Course, CourseCategory, UserCompany, StudentCourse, Section, User, StudentProgress, SectionPage, Text, Lesson } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const getCourses = async (req, res) => {
    let { categories, searchBy, userId } = req.query;
    // let coachIds = await User.findAll({
    //     where: { createdBy: adminId, type: 'coach' },
    //     attributes: ['id']
    // });
    let studentCompany = await UserCompany.findAll({
        where: {
            userId: userId
        }
    });
    let studentCompanyId = studentCompany[0].companyId

    let coachIds = await UserCompany.findAll({
        attributes: ['userId'],
        where: {
            companyId: studentCompanyId
        }
    })

    let courseIds = await StudentCourse.findAll({
        attributes: ['CourseId'],
        where: {
            UserId: userId
        }
    })

    let condition = {}
    let categoryCondition = {}
    condition.createdBy = {
        [Op.in]: coachIds.map(x => x.userId)
    }

    if (categories) {
        categories = categories.split(',')
        categoryCondition.id = {
            [Op.in]: categories
        }
    }

    if (courseIds.length > 0) {
        condition.id = {
            [Op.notIn]: courseIds.map(x => x.CourseId)
        }
    }

    if (searchBy) {
        condition.title = {
            [Op.like]: `%${searchBy}%`
        }
    }

    const course = await CourseCategory.findAll({
        attributes: [['id', 'categoryId'], 'title'],
        include: [{
            model: Course,
            as: "subCategories",
            attributes: [['id', 'courseId'], 'title', 'description', 'image'],
            where: condition,
            include: [{
                attributes: [[Sequelize.fn('SUM', Sequelize.col('totalExperience')), 'totalExperience']],
                model: Section,
                as: 'Section',
                required: false
            }],
            required: false
        }],
        where: categoryCondition,
        group: ['subCategories.title']
    })
    if (course) return ReS(res, { data: course }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.getCourses = getCourses;


const enrollCourse = async (req, res) => {
    let { userId, courseId } = req.body

    let enrolledResult = await StudentCourse.create({
        UserId: userId,
        CourseId: courseId
    })

    if (enrolledResult) return ReS(res, { data: enrolledResult }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.enrollCourse = enrollCourse;

const getUncompletedCourse = async (req, res) => {
    let studentProgress, courseId, sectionPageId, sectionId, totalTextExperience, totalLessonExperience;
    let dataArray = [];
    let { userId } = req.query;


    let uncompleteCourseIds = await StudentCourse.findAll({
        attributes: ['CourseId'],
        where: {
            UserId: userId,
            status: 0
        }
    })
    let uncompleteCourse = await Course.findAll({
        attributes: [['id', 'courseId'], 'title', 'description', 'image'],

        include: [{
            attributes: [[Sequelize.fn('SUM', Sequelize.col('totalExperience')), 'totalExperience']],
            model: Section,
            as: 'Section'
        }],
        group: ["Section.courseId"],

        where: {
            id: uncompleteCourseIds.map(x => x.CourseId)
        }
    })

    studentProgress = await StudentProgress.findAll({
        where: {
            studentId: userId,
            courseId: uncompleteCourseIds.map(x => x.CourseId)
        },

        include: [{

            model: SectionPage,
            as: 'sectionPage',

            include: [{

                model: Text,
                as: 'Text',
                attributes: ['experience']

            },
            {

                model: Lesson,
                as: 'Lesson',
                attributes: ['experience']

            }],

            group: ['Text.sectionPageId', 'Lesson.sectionPageId']

        }],

    })


    for (let index = 0; index < studentProgress.length; index++) {

        sectionId = studentProgress[index].sectionPage.sectionId;
        courseId = studentProgress[index].courseId
        totalTextExperience = studentProgress[index].sectionPage.Text.length > 0 ? studentProgress[index].sectionPage.Text.length == 1 ? studentProgress[index].sectionPage.Text[0].experience :
            studentProgress[index].sectionPage.Text.map((acc) => acc.experience).reduce((acc, val) => acc + val) : 0
        totalLessonExperience = studentProgress[index].sectionPage.Lesson.length > 0 ? studentProgress[index].sectionPage.Lesson.length == 1 ? studentProgress[index].sectionPage.Lesson[0].experience :
            studentProgress[index].sectionPage.Lesson.map((acc) => acc.experience).reduce((acc, val) => acc + val) : 0
        sectionPageId = studentProgress[index].sectionPage.id;

        dataArray.push({
            courseId,
            sectionId,
            totalTextExperience,
            totalLessonExperience,
            sectionPageId

        })

    }

    if (uncompleteCourse) return ReS(res, { data: uncompleteCourse, studentProgress: dataArray }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.getUncompletedCourse = getUncompletedCourse;


const getCompletedCourse = async (req, res) => {
    let studentProgress, texts, lesson, sectionPageId, sectionId, totalTextExperience, totalLessonExperience;
    let dataArray = [];
    let { userId } = req.query;


    let completeCourseIds = await StudentCourse.findAll({
        attributes: ['CourseId'],
        where: {
            UserId: userId,
            status: 1
        }
    })

    let completeCourse = await Course.findAll({
        attributes: [['id', 'courseId'], 'title', 'description', 'image'],


        include: [{
            attributes: [[Sequelize.fn('SUM', Sequelize.col('totalExperience')), 'totalExperience']],
            model: Section,
            as: 'Section'
        }],
        group: ["Section.courseId"],

        where: {
            id: completeCourseIds.map(x => x.CourseId)
        }
    })


    studentProgress = await StudentProgress.findAll({
        where: {
            studentId: userId,
            courseId: completeCourseIds.map(x => x.CourseId)
        },

        include: [{

            model: SectionPage,
            as: 'sectionPage',

            include: [{

                model: Text,
                as: 'Text',
                attributes: ['experience']

            },
            {

                model: Lesson,
                as: 'Lesson',
                attributes: ['experience']

            }],

            group: ['Text.sectionPageId', 'Lesson.sectionPageId']

        }],

    })


    for (let index = 0; index < studentProgress.length; index++) {

        sectionId = studentProgress[index].sectionPage.sectionId;
        totalTextExperience = studentProgress[index].sectionPage.Text.length > 0 ? studentProgress[index].sectionPage.Text.length == 1 ? studentProgress[index].sectionPage.Text[0].experience :
            studentProgress[index].sectionPage.Text.map((acc) => acc.experience).reduce((acc, val) => acc + val) : 0
        totalLessonExperience = studentProgress[index].sectionPage.Lesson.length > 0 ? studentProgress[index].sectionPage.Lesson.length == 1 ? studentProgress[index].sectionPage.Lesson[0].experience :
            studentProgress[index].sectionPage.Lesson.map((acc) => acc.experience).reduce((acc, val) => acc + val) : 0
        sectionPageId = studentProgress[index].sectionPage.id;

        dataArray.push({

            sectionId,
            totalTextExperience,
            totalLessonExperience,
            sectionPageId

        })

    }

    if (completeCourse) return ReS(res, { data: completeCourse, studentProgress: dataArray }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.getCompletedCourse = getCompletedCourse;


const changeStudentCourseStatus = async (req, res) => {
    let { courseId, userId } = req.body;


    const studentCourse = await StudentCourse.update({
        status: 1,
    }, {
            where: {
                courseId: courseId,
                userId: userId
            }
        })

    if (studentCourse) return ReS(res, { data: studentCourse }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.changeStudentCourseStatus = changeStudentCourseStatus;


const getCertificateDetails = async (req, res) => {
    let { courseId, userId } = req.params;


    let user = await User.findAll({
        attributes: [[Sequelize.fn("concat", Sequelize.col("firstname"), ' ', Sequelize.col("lastname")), 'name']],

        include: [{
            model: Course,
            through: StudentCourse,
            attributes: ['title'],

            where: {
                id: courseId
            }

        }],
        where: {
            id: userId
        }
    })


    if (user) return ReS(res, { data: user }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.getCertificateDetails = getCertificateDetails;
