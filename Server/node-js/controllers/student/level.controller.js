const { Level, StudentExperienceSetting, User, UserCompany } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');

const Sequelize = require('sequelize');
const create = async (req, res) => {
    let level;
    let { studentId } = req.body

    const levelGet = await Level.findAll({
        
        where: {
            studentId: studentId
        }
    })

    const userCompany = await UserCompany.findAll({

        attributes: ['companyId'],
        
        where: {
            userId: studentId
        }
    })

    const studentExperienceSettings = await StudentExperienceSetting.findAll({
        attributes: ['initialLevel','initialExperience'],

        where: {
            companyId: userCompany[0].companyId
        }
    })


    if(levelGet.length == 0){

         level = await Level.create({
            studentId: studentId,
            nextExperience: studentExperienceSettings[0].initialExperience,
            currentExperience: 0,
            currentLevel: studentExperienceSettings[0].initialLevel
        })
    }

    
    if (level) return ReS(res, { data: level }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.create = create;


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

const getStudentLevel = async (req, res) => {
    let { studentId } = req.params
    const level = await Level.findAll({
        attributes: ['nextExperience','currentExperience','currentLevel'],
        include: [{
            model: User,
            as: 'student',
            attributes: [[Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']],
        }],
        where: {
            studentId: studentId
        }
    })
    
    if (level) {
        return ReS(res, { data: level}, 200);
    } else {
        return ReS(res, { data: [] }, 200);
    }

}
module.exports.getStudentLevel = getStudentLevel;
