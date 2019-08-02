const { Resource } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const fs = require('fs');
var path = require('path');

const create = async function (req, res) {

    let { sectionId } = req.body
    let bulkObj = req.files.map(fileItem => {
        return {
            sectionId: sectionId,
            url: fileItem.filename
        }
    })
    const resources = await Resource.bulkCreate(bulkObj)

    if (resources) return ReS(res, { data: resources }, 200);
    else return ReE(res, { message: 'Unable to insert resources.' }, 500)
}
module.exports.create = create;

const getResources = async function (req, res) {
    let { sectionId } = req.params
    const resources = await Resource.findAll({
        where: {
            sectionId: sectionId
        }
    })

    if (resources) return ReS(res, { data: resources }, 200);
    else return ReE(res, { message: 'Unable to get resources.' }, 500)
}
module.exports.getResources = getResources;



const update = async function (req, res) {
    let { url } = req.body
    let { resourceId } = req.params
    const resources = await Resource.update({
        url: url
    }, {
            where: {
                id: resourceId
            }
        })
    if (resources) return ReS(res, { data: resources }, 200);
    else return ReE(res, { message: 'Unable to update resources.' }, 500)
}
module.exports.update = update;

const remove = async function (req, res) {
    let { resourceId,filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads/resources/');
    fs.existsSync(`${filePath}${filename}`) == true ? fs.unlinkSync(`${filePath}${filename}`) : null;

    const resource = Resource.destroy({
        where: {
            id: resourceId
        }
    })
    if (resource) {
        return ReS(res, { data: "Deleted." });
    } else {
        return ReS(res, { data: "Unable to Deleted." });
    }
}
module.exports.remove = remove;