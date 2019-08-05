const { Course, CourseCategory, StudentCourse, User } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const getCourses = async (req, res) => {
    let { adminId, categories, searchBy, userId } = req.query;
    let coachIds = await User.findAll({
        where: { createdBy: adminId, type: 'coach' },
        attributes: ['id']
    });
    let courseIds = await StudentCourse.findAll({
        attributes: ['CourseId'],
        where: {
            UserId: userId
        }
    })

    let condition = {}
    let categoryCondition = {}
    condition.createdBy = {
        [Op.in]: coachIds.map(x => x.id)
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
            where: condition
        }],
        where: categoryCondition
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


    let uncompleteCourse = await StudentCourse.findAll({
        where: {
            UserId: userId
        }
    })

    if (uncompleteCourse) return ReS(res, { data: uncompleteCourse }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

module.exports.getUncompletedCourse = getUncompletedCourse;