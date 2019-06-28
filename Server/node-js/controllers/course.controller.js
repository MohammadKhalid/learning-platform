const { Course, Category } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


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
    let { coachId } = req.params
    const course = await Course.findAll({
        attributes: [['id', 'courseId'], 'title', 'description', 'image'],
        include: [{
            model: Category,
            as: "category",
            attributes: [['id', 'categoryId'], 'title']
        }],
        where: {
            createdBy: coachId
        }
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