const { Topic } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, item, categories;
    let user = req.user;

    let item_info = req.body;
    let questions = req.questions;

    [err, item] = await to(Topic.create(item_info, { 
        include: [
            {
                association: 'questions',
                include: ['question']
            }
        ]
    }));
    if(err) return ReE(res, err, 422);

    // question media
    for (var i = item.questions.length - 1; i >= 0; i--) {
        let question = item.questions[i].question;

        question.addMedias(questions[i].question.medias);
        if(err) return ReE(res, err, 422);

        [err, item.questions[i].question] = await to(question.save());
        if(err) return ReE(res, err, 422);
    }
    
    // set categories
    [err, categories] = await to(item.setCategories(req.categories));
    if(err) return ReE(res, err, 422);

    let item_json = item.toWeb();
    item_json.users = [{user:user.id}];

    return ReS(res, {item:item_json}, 201);
}
module.exports.create = create;

const addQuestion = async function(req, res){
    let err, item, data;
    item = req.item;
    data = req.body;

    // get number of questions

    
    // save if new question
    [err, item] = await to(item.addQuestion(data, {}));
    if(err) return ReE(res, err);

    return ReS(res, {item: item.toWeb()});
}
module.exports.addQuestion = addQuestion;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;

    let qParams = {
        attributes: ['id', 'title', 'description', 'content', 'isPrivate'],
        include: [
            {
                association: 'categories',
                attributes: ['id', 'title'],
                required: false
            },
            {
                association: 'questions',
                include: [
                    {
                        association: 'question',
                        include: [ 'medias' ]
                    }
                ]
            }
        ]
    };

    // pagi
    if(req.query.pageNumber && req.query.limit) {
        qParams.offset = parseInt(req.query.pageNumber);
        qParams.limit = parseInt(req.query.limit);
    }

    let whereArgs = { isCustom: false };

    // exclude private flag
    if(user.type !== 'admin') whereArgs.isPrivate = false;

    // search keyword
    if(req.query.title) whereArgs.title = { [Op.like]: req.query.title + '%' };

    // where status
    if(req.query.isActive) {
        if(whereArgs.isActive === 'true') whereArgs.isActive = true;
        else if(whereArgs.isActive === 'false')  whereArgs.isActive = false;
    } else whereArgs.isActive = true;

    // append q
    if(whereArgs) qParams.where = whereArgs;

    // start query
    [err, items] = await to(Topic.findAndCountAll(qParams));

    let items_json =[];
    let item_rows = items.rows;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }
    return ReS(res, {items: items_json, count: items_json.count});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item = req.item;

    return ReS(res, {item:item.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, item, data, categories;
    item = req.item;
    data = req.body;
    data.questions = req.questions;
    
    // item.set(data);
    item.set(data);

    // question
    let question, topicQuestion, question_json;
    let questions = [];

    for (var i = item.questions.length - 1; i >= 0; i--) {
        topicQuestion = item.questions[i];
        question = topicQuestion.question;

        question_json = topicQuestion.toJSON();

        // topic question
        if(question_json.id) {
            topicQuestion.set(question_json);

            [err, topicQuestion] = await to(topicQuestion.save());
            if(err) return ReE(res, err);
        } else {
            [err, topicQuestion] = await to(item.createQuestion(question_json));
            if(err) return ReE(res, err);
        }

        // question
        if(question_json.question.id) {
            question.set(question_json.question);

            [err, question] = await to(question.save());
            if(err) return ReE(res, err);
        } else {
            [err, question] = await to(topicQuestion.createQuestion(question_json.question));
            if(err) return ReE(res, err);
        }

        // add question medias
        [err, question] = await to(question.setMedias(topicQuestion.question.medias));
        if(err) return ReE(res, err);

        questions.push(topicQuestion);
    }

    // set new questions
    [err, item] = await to(item.setQuestions(questions));
    if(err) return ReE(res, err);

    // set categories
    [err, categories] = await to(item.setCategories(req.categories));
    if(err) return ReE(res, err);

    [err, item] = await to(item.save());
    if(err) return ReE(res, err);

    return ReS(res, {item:item.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let item, err, user, show_time, questions;
    user = req.user;
    item = req.item;

    // permission
    if(user.type !== 'admin') return ReE(res, 'Permission denied');
    
    // find relationship
    [err, show_time] = await to(item.getShowTimes());
    if(err) return ReE(res, err);

    // validate relationship
    if(show_time.length > 0) return ReE(res, 'Can\'t delete! Already used in some Show / Practice Time.');

    // questions
    [err, questions] = await to(item.getQuestions());
    if(err) return ReE(res, err);

    if(questions.length > 0) {
        [err, questions] = await to(item.removeQuestions(questions));
        if(err) return ReE(res, err);
    }

    // finally delete
    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'Error occured trying to delete the item time');

    return ReS(res, { success: true, message:'Deleted!' });
}
module.exports.remove = remove;