const { Question, User } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const multiparty = require('multiparty');
const fs = require('fs');
const util = require('util');
const ffmpeg = require('ffmpeg');

const create = async function(req, res){
    let err, item;
    let user = req.user;
    let item_info = req.body;
    let medias = req.medias;

    // set creator id
    item_info.createdByUser = user.id;
    // item_info.topicId

    [err, item] = await to(Question.create(item_info));
    if(err) return ReE(res, err);

    // topic question
    if(item_info.topic) {
        let topic_question;
        [err, topic_question] = await to(item.createTopicQuestion({number: 0, topicId: item_info.topic}));
        if(err) return ReE(res, err, 422);

        // count topics and update
        let topic, topic_questions;

        [err, topic] = await to(topic_question.getTopic());
        if(err) return ReE(res, err, 422);

        // count questions
        [err, topic_questions] = await to(topic.getQuestions());
        if(err) return ReE(res, err, 422);

        // update number
        topic_question.number = topic_questions.length;
        [err, topic_question] = await to(topic_question.save());
        if(err) return ReE(res, err, 422);
    }

    // add media assoc
    if(medias && medias.length > 0) {
        // add medias
        item.addMedias(medias);

        // save practice
        [err, item] = await to(item.save());
        if(err) return ReE(res, err, 422);
    }

    let item_json = item.toWeb();

    return ReS(res, {item: item_json});
}
module.exports.create = create;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;
    let rowPerPage = 25;
    
    let qParams = {
        // attributes: ['id', 'title', 'submitted', 'submittedAt', 'rating', 'topicId'],
        // offset: parseInt(req.query.pageNumber) * rowPerPage,
        // limit: rowPerPage,
    };

    let whereArgs = {};

    // search keyword
    if(req.query.searchQuery) whereArgs.name = { [Op.like]: req.query.searchQuery + '%' };

    [err, items] = await to(Media.findAll(qParams));

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
    let practice = req.practice;

    return ReS(res, {item:practice.toWeb()});
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
    console.log('PRACTICE IDDDDDDDDDD', practice.id);
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