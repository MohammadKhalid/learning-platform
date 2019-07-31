const { Course, CourseCategory, StudentCourse } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const getCourses = async (req, res) => {

    console.log('here')
    // let { userId } = req.params
    // const studentCourseIds = await StudentCourse.findAll({
    //     // attributes: [['CourseId', 'courseId']],
    //     // include: [{
    //     //     model: Course,
    //     //     as: "course",
    //     //     attributes: [['id', 'categoryId'], 'title', 'description', 'image', 'createdBy'],
    //     //     where:{
    //     //         courseId: courseId
    //     //     }
    //     // }],
    //     where: {
    //         UserId: userId
    //     }
    // })

    // let courseIds = studentCourseIds.map(val => val.CourseId);


    // const studentCourses = await Course.findAll({
    //     attributes: [['id', 'courseId'], 'title', 'description', 'image', 'createdby'],
    //     include: [{
    //         model: CourseCategory,
    //         as: "category",
    //         attributes: [['id', 'categoryId'], 'title']
    //     }],
    //     where: {
    //         id: {
    //             [Op.notIn]: courseIds
    //         }
    //     }
    // })

    // if (studentCourses) return ReS(res, { data: studentCourses }, 200);
    // else return ReE(res, { message: 'Unable to get Course.' }, 500)
}
module.exports.getCourses = getCourses;