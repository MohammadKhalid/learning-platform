const { Chat, Message, User } = require('../models');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const { to, ReE, ReS } = require('../services/util.service');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const express = require('express');
const app = express();
const io = require('../io');

const create = async function (req, res) {
    const body = req.body;
    const id = req.body.userId_userId;
    const splitId = id.split('_');
    const reverseId = splitId[1] + '_' + splitId[0];
    const isChatExist = await Chat.findOne({ where: { [Op.or]: [{ userId_userId: id }, { userId_userId: reverseId }] } });
    if (!isChatExist) {
        const chat = await Chat.create({
            userId_userId: id
        });
        return ReS(res, { message: 'created' }, 201);
    }
    return ReS(res, { message: 'already Exist' }, 409);

}

module.exports.create = create;

const findAll = async function (req, res) {
}

module.exports.findAll = findAll;

const find = async function (req, res) {
    const userId = req.params.userId;
    const contactId = req.params.contactId;
    // const limit = req.params.limit;
    // const offset = req.params.offset;
    const reverseId = contactId + "_" + userId
    const date = req.params.date;

    const isChatExist = await Chat.findAll({ where: { [Op.or]: [{ userId_userId: userId + "_" + contactId }, { userId_userId: reverseId }] } });
    const recieverName = await User.findOne({ where: { id: contactId } })
    if (isChatExist.length > 0) {
        const message = await Message.findAll({
            // limit: 50,
            // offset: (limit * offset),
            order: [
                ['id', 'DESC']
            ],
            attributes: ['id', ['Date', 'date'], 'message', 'recieverId', 'senderId', 'createdAt'],
            where: {
                [Op.or]: [{
                    senderId: userId,
                    recieverId: contactId
                }, {
                    senderId: contactId,
                    recieverId: userId
                }],
                Date: {
                    [Op.like]: `%${date}%`
                }
            }
        })

        return ReS(res, { 'chat': isChatExist, 'firstName': recieverName.firstName, 'lastName': recieverName.lastName, isLogin: recieverName.isLogin, 'messages': message }, 200);
    }
    return ReS(res, { 'firstName': recieverName.firstName, 'lastName': recieverName.lastName, isLogin: recieverName.isLogin, message: [] }, 200);
}

module.exports.find = find;

const chatDates = async function (req, res) {
    const userId = req.params.userId;
    const contactId = req.params.contactId;
    const reverseId = contactId + '_' + userId;

    
    const isChatExist = await Chat.findAll({ where: { [Op.or]: [{ userId_userId: userId + "_" + contactId }, { userId_userId: reverseId }] } });
    if (isChatExist.length > 0) {
    const messageDates = await Message.findAll({
            // limit: 50,
            // offset: (limit * offset),
            order: [[sequelize.literal('date'), 'DESC']],
            attributes: [
                [sequelize.fn('DISTINCT',sequelize.fn('DATE_FORMAT',sequelize.col('Date'),'%Y-%m-%d')),'date']
            ],
            where: {
                [Op.or]: [{
                    senderId: userId,
                    recieverId: contactId
                }, {
                    senderId: contactId,
                    recieverId: userId
                }],
                
            }
        })

        return ReS(res, {'data': messageDates }, 200);
    }
    return ReS(res, { 'data': [] }, 200);

}

module.exports.chatDates = chatDates;

const update = async function (req, res) {
    const id = req.body.userId_userId;
    const message = req.body.message;
    const date = req.body.date;
    const splitId = id.split('_');
    const reverseId = splitId[1] + '_' + splitId[0];

    const isChatExist = await Chat.findOne({ where: { [Op.or]: [{ userId_userId: id }, { userId_userId: reverseId }] } });
    if (isChatExist) {
        await Chat.update({
            lastMessage: message,
            lastMessageDate: date
        }, { where: { userId_userId: isChatExist.userId_userId } });

        let messageCreated = await Message.create({
            message: message,
            senderId: splitId[0],
            recieverId: splitId[1],
            Date: date
        })

        io.emit('send-reply', {
            message: {
                message: message,
                senderId: splitId[0],
                recieverId: splitId[1],
                date: date
            }
        });
        return ReS(res, { 'message': messageCreated }, 200);
    } else {

        await Chat.create({
            lastMessage: message,
            lastMessageDate: date,
            userId_userId: id
        });

        let messageCreated = await Message.create({
            message: message,
            senderId: splitId[0],
            recieverId: splitId[1],
            Date: date
        })
        io.emit('send-reply', { message: messageCreated });
        return ReS(res, { 'message': messageCreated }, 200);
    }

}

module.exports.update = update;

const remove = async function (req, res) {
    const id = req.params.id;
    const splitId = id.split('_');
    const reverseId = splitId[1] + '_' + splitId[0];
    await Chat.destroy({ where: { [Op.or]: [{ userId_userId: id }, { userId_userId: reverseId }] } });
    return ReS(res, { message: 'Chat deleted successfully' }, 200);
}

module.exports.remove = remove;
