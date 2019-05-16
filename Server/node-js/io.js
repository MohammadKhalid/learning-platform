var io = require('socket.io')();
const UserController = require('./controllers/user.controller')

io.on('connection', function (socket) {
    socket.on('set-online', (data) => {
        UserController.changeOnlineStatus(data, true);
        io.emit('contact-online',data)
    })
    socket.on('set-offline', data => {
        UserController.changeOnlineStatus(data, false);
        io.emit('contact-offline',data)
    })
    socket.on('disconnect', (data) => {
        console.log('got dc', data)
    })
});

module.exports = io;