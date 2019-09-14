const { Sequelize, Topic, User, Media, TopicQuestion } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, item, mediaModel;
    let user = req.user;
    let item_info = req.body;

    // fix media unprocessable entity
    Topic.beforeCreate((instance, options) => {

        mediaModel = options.include[0].includeMap.question.includeMap.medias.model;
        mediaModel.addHook('beforeCreate', 'addQuestionMedia', (instance) => {
            instance.isNewRecord = false;
        });
    });

    Topic.afterCreate(() => {
        mediaModel.removeHook('beforeCreate', 'addQuestionMedia');
    });

    [err, item] = await to(Topic.create(item_info, {
        include: [
            {
                association: 'questions',
                include: [
                    {
                        association: 'question',
                        include: [
                            { 
                                association: 'medias'
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, err, 422);

    // set response
    item_json = item.toWeb();

    // tag companies
    for (let index = 0; index < item_info.companies.length; index++) {
        const company = item_info.companies[index];
        
        if(company.checked) {
            let userCompanies;
            
            [err, userCompanies] = await to(user.getCompanies({ where: { id: company.id } }));
            if(err) return ReE(res, err, 422);

            [err, userCompanies] = await to(item.addCompanies(userCompanies));
            if(err) return ReE(res, err, 422);
        }
    }

    // add categories
    if(item_info.categories && item_info.categories.length > 0) {
        let categIds = [];
        for (let index = 0; index < item_info.categories.length; index++) {
            categIds.push(item_info.categories[index].id);
        }

        let categories;
        [err, categories] = await to(user.getCategories({ where: { id: { [Op.in]: categIds } } }));

        let itemCategories;
        [err, itemCategories] = await to(item.setCategories(categories));
        if(err) return ReE(res, err, 422);
    }

    // tag user
    [err, user] = await to(item.addUser(user));
    if(err) return ReE(res, err);

    return ReS(res, { item:item_json }, 201);
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
    let err, items;
    let user = req.user;

    // query args
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;

    let whereArgs = {};
    let qParams = {
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
                        include: 'medias'
                    }
                ]
            }
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage
    };

    // search keyword
    if(req.query.title) whereArgs.title = { [Op.substring]: req.query.title };

    // where status
    if(req.query.isActive) {
        if(whereArgs.isActive === 'true') whereArgs.isActive = true;
        else if(whereArgs.isActive === 'false')  whereArgs.isActive = false;
    } else whereArgs.isActive = true;

    // append q
    if(whereArgs) qParams.where = whereArgs;

    // start query
    [err, items] = await to(user.getTopics(qParams));
    if(err) return ReE(res, err);

    let items_json =[];
    let item_rows = items;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }
    
    return ReS(res, {items: items_json});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id;

    [err, item] = await to(user.getTopics({
        where: {
            id: item_id
        },
        include: [ 
            'companies',
            'categories',
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
    }));
    if(err) return ReE(res, "err finding topic");
    if(!item || item.length < 1) return ReE(res, "Topic not found!");

    // set item
    item = item[0];

    return ReS(res, {item: item.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){    
    let err, item, item_info, item_id, user, users, companies;

    user = req.user;
    item_id = req.params.item_id;
    item_info = req.body;

    // load
    [err, item] = await to(user.getTopics({
        where: {
            id: item_id
        }
    }));
    if(err) return ReE(res, "err finding topic");
    if(!item || item.length < 1) return ReE(res, "Topic not found!");

    // set item
    item = item[0];

    [err, item] = await to(item.update(item_info));
    if(err) return ReE(res, err);

    // @TODO. update associations
    // for (let index = 0; index < item_info.questions.length; index++) {
    //     const question = item_info.questions[index];

        
    //     for (let index_m = 0; index_m < question.question.medias.length; index_m++) {
    //         const questionMedia = question.question.medias[index_m];
            
    //     }
    // }

    // response
    let item_json = item.toWeb();

    // set categories
    if(item_info.categories && item_info.categories.length > 0) {
        let categIds = [];
        for (let index = 0; index < item_info.categories.length; index++) {
            categIds.push(item_info.categories[index].id);
        }

        let categories;
        [err, categories] = await to(user.getCategories({ where: { id: { [Op.in]: categIds } } }));

        let itemCategories;
        [err, itemCategories] = await to(item.setCategories(categories, { through: { taggable: 'topic' } }));
        if(err) return ReE(res, err, 422);
    }

    // set companies
    [err, companies] = await to(item.setCompanies([]));
    if(err) return ReE(res, err);    

    for (let index = 0; index < item_info.companies.length; index++) {
        let company = item_info.companies[index];

        if(company.checked) {
            let userCompany;
            [err, userCompany] = await to(user.getCompanies({ where: { id: company.id } }));
            if(err) return ReE(res, err);

            [err, company] = await to(item.addCompanies(userCompany));
            if(err) return ReE(res, err);
        }
    }

    return ReS(res, {item: item_json});
}
module.exports.update = update;

const remove = async function(req, res){
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id || req.body.id;

    [err, item] = await to(user.getTopics({
        where: {
            id: item_id
        },
        include: [
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
    }));
    if(err) return ReE(res, "err finding");
    if(!item || item.length < 1) return ReE(res, "Topic not found!");

    // set item
    item = item[0];

    // remove associations
    await to(item.setCompanies([]));
    await to(item.setCategories([]));
    await to(item.setUsers([]));
    await to(item.setUsers([]));
    // await to(item.removeQuestions());
    await to(TopicQuestion.destroy({ where: { topicId: item.id } }));

    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'error occured trying to delete the item');

    return ReS(res, { success: true, message:'Deleted!' });
}
module.exports.remove = remove;

const formInputData = async function(req, res){
    let err;
    let user = req.user;
    let data = {};

    // @TODO. filter parent categories
    [err, data.categories] = await to(user.getCategories());
    if(err) return ReE(res, err);

    [err, data.companies] = await to(user.getCompanies({ 
        attributes: [ 'id', 'name' ],
        include: [
            {
                association: 'departments',
                attributes: [ 'id', 'name' ]
            }
        ]
    }));
    if(err) return ReE(res, err);

    return ReS(res, data);
}
module.exports.formInputData = formInputData;

const getTemplate = async function(req, res){
    let err, items, userTopics, userTopicIds;
    let user = req.user;

    // current user topics
    [err, userTopics] = await to(user.getTopics({attributes: ['id'], raw : true}));
    if(err) return ReE(res, err);

    // extract ids
    userTopicIds = await userTopics.map((userTopic) => userTopic.id);
    
    [err, items] = await to(Topic.findAll({ 
        where: {
            id: { [Op.notIn] : userTopicIds },
            isPublic: true
        }
    }));
    if(err) return ReE(res, err);

    return ReS(res, { items: items });
}
module.exports.getTemplate = getTemplate;

const importTemplate = async function(req, res){
    let err, items, templateItems;
    let user = req.user;
    let ids = req.body.ids;

    // template
    if(ids && ids.length > 0) {
        [err, templateItems] = await to(Topic.findAll({ 
            where: { 
                id: { [Op.in]: ids },
                isPublic: true 
            }
        }));
        if(err) return ReE(res, err);

        [err, items] = await to(user.addTopics(templateItems));
        if(err) return ReE(res, err);
    }

    let items_json = [];
    let item_rows = templateItems;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }

    return ReS(res, {items: items_json});
}
module.exports.importTemplate = importTemplate;