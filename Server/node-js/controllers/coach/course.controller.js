const { Course, CourseCategory, StudentCourse } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// const enrollCourse = async (req, res) => {
//     let { userId, courseId } = req.body
//     const studentCourse = await StudentCourse.create({
//         status: 0,
//         UserId: userId,
//         CourseId: courseId,
//     })
//     if (studentCourse) return ReS(res, { data: studentCourse }, 200);
//     else return ReE(res, { message: 'Unable to insert Course.' }, 500)
// }
// module.exports.enrollCourse = enrollCourse;




// const updateStudentCourse = async (req, res) => {
//     let { userId, courseId } = req.body
//     const studentCourse = await StudentCourse.create({
//         status: 1,
//         UserId: userId,
//         CourseId: courseId,
//     })
//     if (course) return ReS(res, { data: course }, 200);
//     else return ReE(res, { message: 'Unable to insert Course.' }, 500)
// }
// module.exports.updateStudentCourse = updateStudentCourse;


const create = async (req, res) => {
    let { title, description, categoryId, createdBy } = req.body
    const course = await Course.create({
        title: title,
        description: description,
        categoryId: categoryId,
        createdBy: createdBy,
        image: req.file.filename
    })
    if (course) return ReS(res, { data: course }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.create = create;

const getCourse = async (req, res) => {
    let { categories, searchBy, userId } = req.query
    let condition = {}
    let categoryCondition = {}
    condition.createdBy = userId

    if (categories) {
        categories = categories.split(',')
        categoryCondition.id = {
            [Op.in]: categories
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
module.exports.getCourse = getCourse;

const removeCourse = async (req, res) => {
    let { courseId } = req.params
    const course = await Course.destroy({
        where: {
            id: courseId
        }
    })
    if (course) return ReS(res, { data: course }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.removeCourse = removeCourse;

const updateCourse = async (req, res) => {
    let { courseId } = req.params
    let { title, description, categoryId } = req.body
    const course = await Course.update({
        title: title,
        description: description,
        categoryId: categoryId,
    }, {
            where: {
                id: courseId
            }
        })
    if (course) return ReS(res, { data: course }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.updateCourse = updateCourse;