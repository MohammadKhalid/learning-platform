const { ShowTime, User } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const multiparty = require('multiparty');
const fs = require('fs');
const util = require('util');
// const ffmpeg = require('ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const mandrill = require('mandrill-api/mandrill');
const { send_message } = require('../services/mail.service');
const extractFrames = require('ffmpeg-extract-frames');

const create = async function(req, res){
    let err, item, coach, topic;
    let user = req.user;
    let item_info = req.body;

    // set creator id
    item_info.userId = user.id;

    // is practice time
    if(!req.isPractice) item_info.isPractice = false;

    // validate coach
    if(item_info.submittedTo) {
        [err, coach] = await to(User.findOne({
            where: { id: item_info.submittedTo }
        }));
        if(err) return ReE(res, "Coach not found!");

        item_info.submittedAt = new Date(Date.now()).toISOString();
    }

    // start query
    [err, item] = await to(ShowTime.create(item_info));
    if(err) return ReE(res, err, 422);

    // add user
    item.addUser(user);

    // add coach
    if(coach) item.addUser(coach);

    // custom topic
    if(!item_info.topicId) {
        // set custom topic
        item_info.isCustom = true;
        item_info.createdBy = user.id;

        // set questions
        item_info.questions = [
            {
                number: 1,
                question: {
                    answerLimitTime: 60,
                    createdBy: user.id
                }
            }
        ];

        [err, topic] = await to(item.createTopic(item_info, { 
            include: [
                {
                    association: 'questions',
                    include: ['question']
                }
            ]
        }));
        if(err) return ReE(res, err, 422);
    }

    // save item
    [err, item] = await to(item.save());
    if(err) return ReE(res, err, 422);

    let item_json = item.toWeb();

    // user
    item_json.users = [{user:user.id}];

    // topic
    item_json.topic = topic;

    return ReS(res, {item: item_json}, 201);
}
module.exports.create = create;

const answerQuestion = async function(req, res){
    let err, item, videoFilePath;
    item = req.item;
    
    let item_info = {};
    let files = [];
    let formFiles = [];
    let mediaConverter = ffmpeg();

    // form data
    const uploadDir = './uploads/show-time';
    let form = new multiparty.Form({
        // autoFields: true,
        // autoFiles: true,
        uploadDir: uploadDir
    });

    // Parse form
    await to(new Promise((resolve, reject) => {
        form.on('field', function(name, value) {
            // append
            item_info[name] = value;
        });

        form.on('file', function(name, file) {
            const filePath = file.path;
            const mediaHeaders = file.headers;
            const mediaContentType = mediaHeaders['content-type'].split('/')[0];

            // set new file name
            if(mediaContentType === 'video' || mediaContentType === 'application/octet-stream') {
                videoFilePath = filePath.split('.')[0] + '.mp4';
            }

            mediaConverter.addInput(filePath);
        });

        // close emitted after form parsed
        form.on('close', function() {
            resolve();
        });

        // start parse req
        form.parse(req);
    }));

    // save
    let answer;
    // [err, answer] = await to(item.createAnswer(item_info, { through: { topicQuestionId: item_info.topicQuestionId } }));
    // if(err) return ReE(res, err, 422);

    // media
    console.log('FILES ', files);

    mediaConverter.format('mp4');
    // mediaConverter.videoBitrate('1024k');
    // mediaConverter.audioBitrate('128k');
    // mediaConverter.audioChannels(2);
    // mediaConverter.size('720x?');
    // mediaConverter.keepDAR();

    // console.log('MEDIA CONVERTER ', mediaConverter);

    // mediaConverter.output(videoFile)
    mediaConverter.on('error', function(err) {
        console.log('An error occurred: ' + err.message);
    });
    mediaConverter.on('end', function() {
        console.log('Merging finished !');

        // ffmpeg(videoFilePath).screenshots({
        //     timemarks: [ 1 ],
        //     filename: '%b.png',
        //     folder: uploadDir
        // });
    });
    mediaConverter.on('start', function(commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
    });
    mediaConverter.save(videoFilePath);

    // let mergeMedia = ffmpeg_fluent(files[1].path)
    //     .mergeAdd(files[0].path)
    //     // .complexFilter([
    //     //     '[1:0] adelay=2728000|2728000 [delayed]',
    //     //     '[0:1][delayed] amix=inputs=2',
    //     // ])
    //     // .outputOption('-map 0:0')
    //     // .audioCodec('aac')
    //     // .videoCodec('copy')
    //     .save(uploadDir + '/test.mp4');

    // for (var i = files.length - 1; i >= 0; i--) {
    //     const file = files[i];

    //     console.log('FILE ' + i, file);

    //     // convert if video
    //     let videoType = file.type.split('/')[0];

    //     if(videoType === 'video' || file.type === 'application/octet-stream') {
    //         try {
    //             var process = new ffmpeg(file.path);
    //                 process.then(function (video) {
    //                     let tempFilePath = file.path.split('.');
    //                     let newFilePath = tempFilePath[0] + '.mp4';

    //                     video
    //                         .addCommand('-i ' + files[1].path)
    //                         .setVideoFrameRate(30)
    //                         .save(newFilePath, function (error, newFile) {
    //                             if (error) console.log('Error saving encoded file ', newFile);
    //                         });
    //                 }, function (err) {
    //                     console.log('Error encoding ', file);
    //             });
    //         } catch (e) {
    //             console.log('Error FFMPEG!');
    //         }
    //     }

    //     // save file
    //     // answer.createMedia(file);

    //     // // In this example will be changed the output to avi format
    //     // video.addCommand('-f', 'avi');
    // }

    // let item_json = item.toWeb();
    let item_json = '';
    return ReS(res, {item:item_json}, 201);
}
module.exports.answerQuestion = answerQuestion;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;

    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;
    
    // query args
    let whereArgs = { isPractice: req.isPractice || false };
    let qParams = {
        // attributes: ['id', 'title', 'submitted', 'submittedAt', 'rating'],
        include: [
            {
                association: 'student',
                attributes: ['firstName', 'lastName']
            },
            {
                association: 'coach',
                attributes: ['firstName', 'lastName']
            },
            { 
                association: 'topic',
                attributes: ['title', 'description']
            }
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage,
        order: [
            ['createdAt', 'DESC'],
            ['submittedAt', 'DESC']
        ]
    };

    // search keyword
    if(req.query.searchQuery) whereArgs.title = { [Op.like]: req.query.searchQuery + '%' };

    // filter by user
    if(req.query.userId) whereArgs.userId = req.query.userId;
    if(req.query.submittedTo) whereArgs.submittedTo = req.query.submittedTo;

    // append where
    qParams.where = whereArgs;

    [err, items] = user.type !== 'admin' ? await to(user.getShowTimes(qParams)) : await to(ShowTime.findAll(qParams));

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

const updateReview = async function(req, res){
    let err, item, data;
    item = req.item;
    data = req.body;
    item.set(data);

    [err, item] = await to(item.save());
    if(err){
        return ReE(res, err);
    }

    // @TODO. notify related users

    return ReS(res, {item:item.toWeb()});
}
module.exports.updateReview = updateReview;

const submit = async function(req, res){
    let err, item, data, coach;
    item = req.item;
    data = req.body;

    // validate
    // if(item.submittedTo) return ReE(res, "Already submitted!");
    // else if(!data.submittedTo && !data.sendTo) return ReE(res, "Select a coach or enter send to recipient!");

    // set form data
    let item_data = {
        submittedAt: new Date(Date.now()).toISOString()
    };

    // validate coach
    if(data.submittedTo) {
        [err, coach] = await to(User.findOne({
            where: { id: data.submittedTo }
        }));

        if(!err) {
            // add coach
            item.addUser(coach, { through: { status: 'started' }});
            item_data.submittedTo = data.submittedTo;
        }
    }

    // send to
    if(data.sendTo) {
        item_data.sendTo = data.sendTo;

        // notify related users
        // submitted to, send to
        composeEmail(item.id, item_data.sendTo);
    }

    item.set(item_data);

    [err, item] = await to(item.save());
    if(err){
        return ReE(res, err);
    }

    return ReS(res, {item:item.toWeb()});
}
module.exports.submit = submit;

const remove = async function(req, res){
    let item, err, user;
    user = req.user;
    item = req.item;

    // validate
    if(user.type !== 'admin') {
        if(item.userId !== user.id) return ReE(res, 'Permission denied');
        if(item.submitted === true) return ReE(res, "Cant't delete! Already submitted");
    }

    // delete file
    if(item.videoPath) {
        let videoPath = item.videoPath.split('.');
        let videoFile = videoPath[0] + '.mp4';
    
        fs.unlinkSync(item.videoPath); // webm
        fs.unlinkSync(videoFile); // mp4
    }

    // finally delete
    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'Error occured trying to delete the item time');

    return ReS(res, { success: true, message:'Deleted!' });
}
module.exports.remove = remove;

async function composeEmail(item_id, recipientList) {
    let err, item;
    const mediaViewerUrl = 'public/media-viewer/';
    let appUrl = 'https://thrive19.com/';
    let baseUrl = 'https://api.thrive19.com/v1/';
    // let baseUrl = 'http://api.thrive19.local:3000/v1/';
    
    let body_html = '';
    let coachFirstName = '-';
    let coachLastName = '';

    [err, item] = await to(ShowTime.findOne({
        where: { id:item_id },
        include: [ 
            {
                association: 'answers',
                include: ['medias']
            },
            {
                association: 'coach',
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                association: 'student',
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                association: 'topic',
                include: [ 
                    {
                        association: 'questions',
                        include: [ 
                            {
                                association: 'question',
                                include: ['medias']
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);

    item = item.toJSON();

    const assestmentType = item.isPractice ? 'Practice Time' : 'Show Time';

    // topic
    let topicTitle = item.topic.title ? item.topic.title : 'No topic title';
    let topicDescription = item.topic.description ? item.topic.description : 'No description';

    let subject = 'Thrive19.com | ' + assestmentType;
    let sendTo = ((recipientList.replace(/\s/g, '')).replace(/,\s*$/, '')).split(',');
    let sendToArray = [].concat(sendTo);
    let extra = {
        from_name: item.student.firstName + ' ' + item.student.lastName
    };
    const inboxPreview = topicTitle + ' - ' + topicDescription + ' ............................................................';

    let recipients = [];

    // for debugging
    recipients.push({email: 'manvillt@gmail.com'});

    for (var i = sendToArray.length - 1; i >= 0; i--) {
        recipients.push({email: sendToArray[i]});
    }

    // coach name
    if(item.coach) {
        coachFirstName = item.coach.firstName;
        coachLastName = item.coach.lastName;
    }

    // build answer
    let answers = {};
    for (var ii = item.answers.length - 1; ii >= 0; ii--) {
        for (var i = item.answers[ii].medias.length - 1; i >= 0; i--) {
            let media       = item.answers[ii].medias[i];

            let type        = media.type;
            let typeArray   = type.split('/')[0];

            let mediaPaths = [
                { type: type, path: baseUrl + media.path }
            ];

            if(typeArray === 'video' || type === 'application/octet-stream') {
                // media path
                let mediaPath = media.path;

                let mediaPathArray  = mediaPath.split('.');
                let mediaFileExt    = mediaPathArray[mediaPathArray.length - 1];
                
                if(mediaFileExt !== 'mp4') {
                    let newMediaPathArray   = mediaPathArray;
                    newMediaPathArray.pop();
                    mediaPath = newMediaPathArray.join('.') + '.mp4';
                }

                // set video link
                if(!item.answers[ii].videoPath) item.answers[ii].videoPath = baseUrl + mediaPath;

                // set poster
                if(!item.answers[ii].videoPoster) item.answers[ii].videoPoster = media.snapshot ? baseUrl + media.snapshot : baseUrl + 'img/video-poster.jpg';

                mediaPaths.push({type: 'video/mp4', path: baseUrl + mediaPath});
            }
            
            item.answers[ii].medias[i].paths = mediaPaths;
        }

        answers[item.answers[ii].ShowTimeAnswer.topicQuestionId] = item.answers[ii];
    }

    let questionsHtml = '';
    for (var i = item.topic.questions.length - 1; i >= 0; i--) {
        let challenge = item.topic.questions[i];

        questionsHtml += '<div style="margin-bottom:1px; padding: 1.6rem;min-height: 30px; background-color: #222222; text-align: center; color: #eeeeee;">';
        
            // add question header
            if(!item.topic.isCustom) questionsHtml += '<h3 style="font-size: 20px;margin:0 0 .6rem; padding:0; color:#3dc4e2;">Challenge #' + challenge.number + '</h3> \
            <p style="font-size: 14px;margin:0 0 1.6rem; padding:0; font-size: 13px; letter-spacing: .5px;">' + challenge.question.question + '</p>';

            if(answers[challenge.id]) {
                questionsHtml += '<div>';
                    questionsHtml += '<video \
                        poster="' + answers[challenge.id].videoPoster + '" width="100%" controls="controls"> \
                    ';

                    for (var ii = answers[challenge.id].medias[0].paths.length - 1; ii >= 0; ii--) {
                        let mediaPath = answers[challenge.id].medias[0].paths[ii];

                        if(answers[challenge.id].medias[0].type === 'video/webm' || answers[challenge.id].medias[0].type === 'video/mp4' || answers[challenge.id].medias[0].type === 'application/octet-stream') {
                            questionsHtml += '<source src="' + mediaPath.path + '" type="' + mediaPath.type +'" />';
                        }
                    }

                    // for unsupported video
                    questionsHtml += '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 4px;overflow: hidden;"><tr><td valign="center">';
                    questionsHtml += '<a href="' + appUrl + mediaViewerUrl + answers[challenge.id].medias[0].id +'" style="display:block;height: 350px;background-image: url(' + answers[challenge.id].videoPoster + ');background-position: center;background-repeat: no-repeat;background-size: cover;"> \
                            <img src="' + baseUrl + 'img/play-button.png" width="100px" style="margin-top: 25%;"> \
                        </a>';
                    questionsHtml += '</td></tr></table>';

                    questionsHtml += '</video>';

                questionsHtml += '</div>';
            } else {
                questionsHtml += '<p style="color: red;">No answer provided.</p>';
            }

        questionsHtml += '</div>';
    }

    body_html = '<center> \
        <table border="0" cellpadding="0" cellspacing="0" width="100%" \
            style="height:100%;margin:0;padding:30px 0 20px;background-color:#eee;width:100%!important"> \
            <tbody> \
                <tr> \
                    <td align="center" valign="top"> \
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#0065b3"> \
                            <tbody> \
                                <tr> \
                                    <td valign="top" \
                                        style="color:#3276b1;font-family:Arial;font-size:10px;line-height:100%;text-align:left"> \
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="top"> \
                                                        <div \
                                                            style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">'
                                                            + inboxPreview + 
                                                        '</div><br> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                            </tbody> \
                        </table> \
                        <table border="0" cellpadding="0" cellspacing="0" width="600" \
                            style="border:0;background-color:#fdfdfd"> \
                            <tbody> \
                                <tr> \
                                    <td align="center" valign="top"> \
                                        <table border="0" cellpadding="0" cellspacing="0" width="600" \
                                            style="background-color:#f4f4f4;border-bottom:0"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="center" width="50%"> \
                                                        <div style="padding: 1rem 1.5rem;"> \
                                                            <img alt="" border="0" src="https://thrive19.com/assets/img/logo.png" width="175"> \
                                                        </div> \
                                                    </td> \
                                                    <td valign="center" width="50%"> \
                                                        <h1 style="font-family: Arial, Helvetica, sans-serif; font-size: 22px;margin:0; padding:0 1.6rem 0 0; text-transform: uppercase; text-align:right;">' + subject + '</h1> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                                <tr> \
                                    <td align="center" valign="top"> \
                                        <table border="0" cellpadding="0" cellspacing="0" width="600"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="top" \
                                                        style="background-color:#fdfdfd;color:#505050;font-family:Arial;font-size:14px;line-height:150%;text-align:left;"> \
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"> \
                                                            <tbody> \
                                                                <tr> \
                                                                    <td valign="top"> \
                                                                        <div style="background-color:#f4f4f4;padding:1rem 1.6rem .2rem;border-bottom:2px dashed #cccccc;"> \
                                                                            <div style="padding:3px 0 8px;font-size:14px;"> \
                                                                                <table width="100%" height="100%" border="0" \
                                                                                    cellspacing="0" cellpadding="0"> \
                                                                                    <tbody> \
                                                                                        <tr> \
                                                                                            <td valign="top" width="50%"> \
                                                                                                <div style="color:#999; font-size: 12px;">NAME</div> \
                                                                                                ' + item.student.firstName + ' \
                                                                                                ' + item.student.lastName + ' \
                                                                                            </td> \
                                                                                            <td valign="top" width="50%"> \
                                                                                                <div style="color:#999; font-size: 12px;">COACH</div> \
                                                                                                ' + coachFirstName + ' \
                                                                                                ' + coachLastName + ' \
                                                                                            </td> \
                                                                                        </tr> \
                                                                                    </tbody> \
                                                                                </table> \
                                                                            </div> \
                                                                        </div> \
                                                                        <div style="padding:1.6rem; text-align: center;"> \
                                                                            <h2 style="font-size: 20px;margin:0 0 1rem; padding:0; color:#0065b3;">' + topicTitle + '</h2> \
                                                                            <p style="margin:0 0 1.6rem; padding:0; color:#999999; font-size: 14px;">' + topicDescription + '</p> \
                                                                            ' + questionsHtml + ' \
                                                                        </div> \
                                                                        <div style="padding:1.6rem;"> \
                                                                            <p \
                                                                                style="font-weight:bold;margin-bottom:25px;font-size:14px"> \
                                                                                Support Team <br><span \
                                                                                    style="font-size:12px;color:#999999;">THRIVE19.com</span> \
                                                                            </p> \
                                                                            <p style="font-size:11px;margin-bottom:15px">If you have any questions or for more information on how we can help increase your sales. Contact us at -  \
                                                                                <a href="mailto:support@thrive19.com" style="color:#336699;font-weight:normal;text-decoration:underline" target="_blank">support@thrive19.com</a> \
                                                                            </p> \
                                                                        </div> \
                                                                    </td> \
                                                                </tr> \
                                                            </tbody> \
                                                        </table> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                                <tr> \
                                    <td align="center" valign="top"> \
                                        <table border="0" cellpadding="10" cellspacing="0" width="600" \
                                            style="background-color:#fafafa;border-top:1px solid #dddddd"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="top"> \
                                                        <table border="0" cellpadding="10" cellspacing="0" width="100%"> \
                                                            <tbody> \
                                                                <tr> \
                                                                    <td valign="top" width="370" style="font-size:12px"><br> \
                                                                        <div \
                                                                            style="color:#707070;font-family:Arial;font-size:12px;line-height:125%;text-align:center"> \
                                                                            <em>&copy; <span>2019</span>. <a href="https://thrive19.com/" style="color:#0065b3; text-decoration: none;">Thrive19.com - Let Your Self Grow</a>. All rights reserved.</em> <br> \
                                                                            <br> \
                                                                            <strong>Our mailing address is:</strong> <br> \
                                                                            <div><a href="https://thrive19.com/" style="color:#0065b3; text-decoration: none; font-weight: bold;">THRIVE19.com</a> \
                                                                                <div> \
                                                                                    <div>PO Box 1611</div> \
                                                                                    <div>Bondi Junction</div> \
                                                                                    <span>Sydney</span>, <span>Nsw</span> \
                                                                                    <span>1355</span> \
                                                                                    <div>Australia</div> \
                                                                                </div> \
                                                                            </div> \
                                                                        </div> \
                                                                    </td> \
                                                                </tr> \
                                                            </tbody> \
                                                        </table> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                            </tbody> \
                        </table> \
                    </td> \
                </tr> \
            </tbody> \
        </table> \
    </center>';

    send_message(subject, body_html, recipients, extra);
}