const { Media } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const multiparty = require('multiparty');
const fs = require('fs');
const util = require('util');
const ffmpeg = require('ffmpeg');

const create = async function(req, res){
    let err, item;
    let user = req.user;
    let item_info = {};

    // form data
    var form = new multiparty.Form();

    // form.autoFiles = true;
    form.uploadDir = './uploads/media';

    // Parse form
    await to(new Promise((resolve, reject) => {
        form.on('field', function(name, value) {
            // append
            item_info[name] = value;
        });

        form.on('file', function(name, file) {
            // append
            item_info.path      = file.path;
            item_info.size      = file.size;
            item_info.type      = file.headers['content-type'];
            item_info.filename  = file.originalFilename;
        });

        // close emitted after form parsed
        form.on('close', function() {
            resolve();
        });

        // start parse req
        form.parse(req);
    }));

    // save
    [err, item] = await to(user.createMedia(item_info));
    if(err) return ReE(res, err, 422);
    let item_json = item.toWeb();

    // media
    setTimeout(function() {
        // convert if video
        let videoType = item_info.type.split('/')[0];

        if(videoType === 'video' || item_info.type === 'application/octet-stream') {
            try {
                var process = new ffmpeg(item_info.path);
                    process.then(function (video) {
                        let tempFilePath = item_info.path.split('.');
                        let newFilePath = tempFilePath[0] + '.mp4';

                        video
                            // .setVideoFrameRate(25)
                            .save(newFilePath, async function (error) {
                                if (error) console.log('Error saving file', error);
                                else fs.unlink(item_info.path, function(err) {
                                    if (err) console.log('Error deleting file', err);
                                }); // delete orig uploaded
                        });
                    }, function (err) {
                        console.log('Error encoding ', item_info);
                        item_info.path
                });
            } catch (e) {
                console.log('Error FFMPEG!');
            }
        }
    });

    return ReS(res, {item: item_json}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;
    let rowPerPage = 25;
    
    let qParams = {
        where: {}
        // attributes: ['id', 'title', 'submitted', 'submittedAt', 'rating', 'topicId'],
        // offset: parseInt(req.query.pageNumber) * rowPerPage,
        // limit: rowPerPage,
    };

    // search keyword
    if(req.query.searchQuery) req.query.where.name = { [Op.like]: req.query.searchQuery + '%' };

    [err, items] = await to(user.getMedias(qParams));

    let items_json =[]
    for( let i in items){
        let item = items[i];

        let item_info = item.toWeb();
        items_json.push(item_info);
    }

    return ReS(res, {items: items_json});
}
module.exports.getAll = getAll;

const get = function(req, res){
    let item = req.item;

    return ReS(res, {item:item.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, practice, data;
    practice = req.practice;
    data = req.body;
    practice.set(data);

    [err, practice] = await to(practice.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {practice:practice.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let practice, err, user;
    user = req.user;
    practice = req.practice;

    [err, practice] = await to(practice.destroy());
    if(err) return ReE(res, 'Error occured trying to delete the practice time');

    // validate
    if(practice.userId !== user.id) return ReE(res, 'Permission denied');
    if(practice.submitted === true) return ReE(res, "Cant't delete! Already submitted");

    // delete file
    let videoPath = practice.videoPath.split('.');
    let videoFile = videoPath[0] + '.mp4';
    
    fs.unlinkSync(practice.videoPath); // webm
    fs.unlinkSync(videoFile); // mp4

    return ReS(res, { success: true, message:'Deleted Practice Time'});
}
module.exports.remove = remove;