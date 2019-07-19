const { AskExpert, User } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const multiparty = require('multiparty');
const fs = require('fs');
const util = require('util');
const ffmpeg = require('ffmpeg');
const mandrill = require('mandrill-api/mandrill');
const { send_message } = require('../services/mail.service');

const create = async function(req, res){
    let err, item, coach;
    let user = req.user;
    let item_info = req.body;
    let medias = req.medias;

    // set creator id
    item_info.userId = user.id;

    // validate coach
    if(item_info.submittedTo) {
        [err, coach] = await to(User.findOne({
            where: { id: item_info.submittedTo }
        }));
        if(err) return ReE(res, "Coach not found!");

        item_info.submittedAt = new Date(Date.now()).toISOString();
    }

    // start query
    [err, item] = await to(AskExpert.create(item_info));
    if(err) return ReE(res, err, 422);

    // add user
    item.addUser(user);

    // add coach
    if(coach) item.addUser(coach);

    // save item
    [err, item] = await to(item.save());
    if(err) return ReE(res, err, 422);

    // add media assoc
    if(medias && medias.length > 0) {
        // add medias
        item.addMedias(medias);

        // save
        [err, item] = await to(item.save());
        if(err) return ReE(res, err, 422);
    }

    let item_json = item.toWeb();

    return ReS(res, {item: item_json}, 201);
}
module.exports.create = create;

const questionAnswer = async function(req, res){
    let err, item;
    let user = req.user;
    let medias = req.medias;
    item = req.item;
    
    let item_info = req.body;
    // set creator id
    item_info.userId = user.id;

    let answer;
    [err, answer] = await to(item.createQuestionAnswer(item_info));
    if(err) return ReE(res, err, 422);

    // add media assoc
    if(medias && medias.length > 0) {
        // add medias
        answer.addMedias(medias);

        // save
        [err, answer] = await to(answer.save());
        if(err) return ReE(res, err, 422);
    }

    let item_json = answer.toWeb();
    
    // append media
    item_json.medias = medias ? medias : [];
    
    // user
    item_json.user = user;

    // ask expert id
    item_json.askExpertId = item.id;

    return ReS(res, {item:item_json}, 201);
}
module.exports.questionAnswer = questionAnswer;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;
    let rowPerPage = 25;
    let whereArgs = { status: 'open' };
    
    let qParams = {
        // attributes: ['id', 'title', 'submitted', 'submittedAt', 'rating'],
        include: [
            {
                association: 'user',
                attributes: ['firstName', 'lastName']
            },
            {
                association: 'coach',
                attributes: ['firstName', 'lastName']
            }
        ],
        offset: parseInt(req.query.pageNumber) * rowPerPage,
        limit: rowPerPage,
        order: [
            ['createdAt', 'DESC'],
            ['submittedAt', 'DESC']
        ]
    };

    // search keyword
    // if(req.query.searchQuery) whereArgs.text = { [Op.like]: req.query.searchQuery + '%' };

    // append where
    qParams.where = whereArgs;

    [err, items] = user.type !== 'admin' ? await to(user.getAskExperts(qParams)) : await to(AskExpert.findAll(qParams));

    let items_json =[]
    for( let i in items){
        let item = items[i];
        let users =  item.users;
        let item_info = item.toWeb();
        let users_info = [];
        for (let i in users){
            let user = users[i];
            // let user_info = user.toJSON();
            users_info.push({user:user.id});
        }
        item_info.users = users_info;
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
    let err, item, data;
    item = req.item;
    data = req.body;
    item.set(data);

    [err, item] = await to(item.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {item:item.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let item, err, user;
    user = req.user;
    item = req.item;

    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'Error occured trying to delete the item time');

    // validate
    if(item.userId !== user.id) return ReE(res, 'Permission denied');
    if(item.submitted === true) return ReE(res, "Cant't delete! Already submitted");

    // delete file
    if(item.videoPath) {
        let videoPath = item.videoPath.split('.');
        let videoFile = videoPath[0] + '.mp4';
    
        fs.unlinkSync(item.videoPath); // webm
        fs.unlinkSync(videoFile); // mp4
    }

    return ReS(res, { success: true, message:'Deleted!'});
}
module.exports.remove = remove;