const { Course, CourseCategory, UserCompany, StudentCourse, Section, User } = require('../../models');
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
    let { userId } = req.query;


    let uncompleteCourseIds = await StudentCourse.findAll({
        attributes: ['CourseId'],
        where: {
            UserId: userId,
            status: 0
        }
    })
    console.log(uncompleteCourseIds.map(x => x.id))
    let uncompleteCourse = await Course.findAll({
        attributes: [['id', 'courseId'], 'title', 'description', 'image'],
        where: {
            id: uncompleteCourseIds.map(x => x.CourseId)
        }
    })
    // let uncompleteCourse = await Course.findAll({
    //     attributes: [['id','courseId'],'title','description','image'],
    //     include: [{
    //         model: User,
    //         where:{
    //             id: userId
    //         }
    //     }]
    // })

    if (uncompleteCourse) return ReS(res, { data: uncompleteCourse }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.getUncompletedCourse = getUncompletedCourse;


const getCompletedCourse = async (req, res) => {
    let { userId } = req.query;


    let completeCourseIds = await StudentCourse.findAll({
        attributes: ['CourseId'],
        where: {
            UserId: userId,
            status: 1
        }
    })
    console.log(completeCourseIds.map(x => x.id))
    let completeCourse = await Course.findAll({
        attributes: [['id', 'courseId'], 'title', 'description', 'image'],
        where: {
            id: completeCourseIds.map(x => x.CourseId)
        }
    })
    // let uncompleteCourse = await Course.findAll({
    //     attributes: [['id','courseId'],'title','description','image'],
    //     include: [{
    //         model: User,
    //         where:{
    //             id: userId
    //         }
    //     }]
    // })

    if (completeCourse) return ReS(res, { data: completeCourse }, 200);
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
        attributes: [[Sequelize.fn("concat", Sequelize.col("firstname"),' ', Sequelize.col("lastname")),'name']],

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
