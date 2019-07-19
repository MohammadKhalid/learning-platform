const { Contact, Chat,User } = require('../models');
// const User = require('../models/user.model');
const chatModel = require('../models/chat.model');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const { to, ReE, ReS } = require('../services/util.service');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const io = require('../io')

const create = async function (req, res) {
    const body = req.body;
    const contact = await Contact.create(body);
    const reverseContact = await Contact.create({
        user_id: req.body.contact_id,
        contact_id: req.body.user_id,
    });
    io.emit('contact-online',{user_id: req.body.contact_id})
    //const splitId = id.split('_');
    const reverseId = req.body.user_id +'_'+ req.body.contact_id;
//    const chat = await Chat.create({ 
//                 userId_userId: reverseId
//             });
    return ReS(res, {message: contact }, 200);
}
module.exports.create = create;

const findAll = async function (req, res) {
    const contacts = await Contact.findAll({}, { include: [{ association: 'userss' }] });
    return ReS(res, { message: contacts }, 200);
}
module.exports.findAll = findAll;


const getContactById = async function (req, res) {
    let type = req.params.type == 'student'? 'coach': 'student'
    const contacts = await Contact.findAll({
        attributes: ['contact_id'],
        where:{
            user_id: req.params.id
        }, 
        raw: true,
    })
    let ids = contacts.map(row=>{ return row.contact_id})
    const users = await User.findAll({ raw: true, where: {
        id: {[Op.notIn]: ids},
        type: type
    }})
    return ReS(res, { message: users }, 200);
}
module.exports.getContactById = getContactById;

const find = async function (req, res) {
    const contact = await Contact.findAll({
        where: { 
            user_id: req.params.id 
        },
        include: [{
            association: 'userss',
            attributes: ['type', 'email', 'username', 'firstName', 'lastName','isLogin']
        }],
        raw: true
    });
    let finalData = []
    for(var i=0;i<contact.length;i++){
        let type = contact[i]['userss.type']
        let email = contact[i]['userss.email']
        let userName= contact[i]['userss.username']
        let firstName= contact[i]['userss.firstName']
        let lastName= contact[i]['userss.lastName']
        let isLogin= contact[i]['userss.isLogin']
        let user_id = contact[i].user_id
        let contact_id = contact[i].contact_id
        let user_contact = user_id + "_" + contact_id
        let contact_user = contact_id + "_" + user_id
        const chats = await Chat.findAll({
            where: {
                [Op.or]: [{ userId_userId: user_contact }, { userId_userId: contact_user }]
            },
            raw: true
        })
        let obj = {
            type,
            email,
            userName,
            firstName,
            lastName,
            lastMessage: chats.length > 0 ?chats[0].lastMessage:'',
            lastMessageDate: chats.length > 0 ?chats[0].lastMessageDate:'',
            user_id,
            contact_id,
            isLogin
        }
        finalData.push(obj)
    }
  
    return ReS(res, { message: finalData }, 200);
}
module.exports.find = find;

const update = async function (req, res) {
    const contact = await Contact.findOne({ where: { id: req.params.id } });
    let isExist = false;
    if (isExist) {
        return ReS(res, { message: 'Contact already exist' }, 409);
    } else {
        contact.contactList.push(req.body.contactList);
        await Contact.update({ contactList: contact.contactList }, { where: { user_id: req.params.id } });
        return ReS(res, { message: 'updated Successfully' }, 200);
    }
}
module.exports.update = update;

const remove = async function (req, res) {
    await Contact.destroy({ where: { user_id: req.params.id } });
    return ReS(res, { message: 'deleted Sucessfully' }, 200);
}
module.exports.remove = remove;