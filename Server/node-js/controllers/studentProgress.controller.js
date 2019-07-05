const { StudentProgress } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function (req, res) {

    let { userId, lessonId, sectionId} = req.body
    const progress = await StudentProgress.create({
        studentId: userId,
        lessonId: lessonId,
        sectionId: sectionId
    })

    if (progress) return ReS(res, { data: progress }, 200);
    else return ReE(res, { message: 'Unable to insert answer.' }, 500)
}
module.exports.create = create;     
