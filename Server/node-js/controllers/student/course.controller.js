const { Course, CourseCategory, StudentCourse, User } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const getCourses = async (req, res) => {
    let { adminId, categories, searchBy } = req.query;
    let coachIds = await User.findAll({
        where: { createdBy: adminId, type: 'coach' },
        attributes: ['id']
    });

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
    // let courses = await Course.findAll({
    //     where: {
    //         createdBy: {
    //             [Op.in]: coachIds.map(x => x.id)
    //         },
    //         attributes:['id','title','description','image',]
    //     },
    //     include: [
    //         {
    //             model: User,
    //             as: 'coach',
    //             attributes: [[Sequelize.fn("CONCAT", Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), "fullName"]]

    //         }
    //     ]
    // });
    // res.send(courses);
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