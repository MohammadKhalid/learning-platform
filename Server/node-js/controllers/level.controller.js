const { Level, StudentExperienceSettings } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const update = async function (req, res) {
    let nextExperience;
    let { studentExperience, studentLevel } = req.body
    let { studentId } = req.params
    const currentLevel = await Level.findOne({
        where: {
            studentId: studentId
        }
    })

    currentExperience = studentExperience + currentLevel.currentExperience;

    if(studentExperience == currentLevel.nextExperience ||
        studentExperience > currentLevel.nextExperience){
            nextExperience = currentLevel.nextExperience * 1.5;
            studentLevel = studentLevel + 1;
         }
    
    const level = await Level.update({
        nextExperience: nextExperience,
        currentExperience: studentExperience,
        currentLevel: studentLevel
    }, {
            where: {
                studentId: studentId
            }
        })
    if (level) return ReS(res, { data: level }, 200);
    else return ReE(res, { message: 'Unable to update settings.' }, 500)
}
module.exports.update = update;
