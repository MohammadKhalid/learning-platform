const { Resource } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const fs = require('fs');
var path = require('path');



const getSectionResourcesForStudent = async function (req, res) {
    let { sectionId } = req.params
    const resources = await Resource.findAll({
        where: {
            sectionPageId: sectionId
        }
    })

    if (resources) return ReS(res, { data: resources }, 200);
    else return ReE(res, { message: 'Unable to get resources.' }, 500)
}
module.exports.getSectionResourcesForStudent = getSectionResourcesForStudent;

// const getResourcesForStudent = async function (req, res) {
//     let { sectionId } = req.params
//     const resources = await Resource.findAll({
//         where: {
//             sectionId: sectionId,
//         },
//         group: ['title']
//     })

//     if (resources) return ReS(res, { data: resources }, 200);
//     else return ReE(res, { message: 'Unable to get resources.' }, 500)
// }
// module.exports.getResourcesForStudent = getResourcesForStudent;