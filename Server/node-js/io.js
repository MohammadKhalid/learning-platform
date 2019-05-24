var io = require('socket.io')();
var RTCMultiConnectionServer = require('rtcmulticonnection-server')
const UserController = require('./controllers/user.controller')
const port = normalizePort(CONFIG.port || '3000');

io.on('connection', function (socket) {
    socket.on('set-online', (data) => {
        UserController.changeOnlineStatus(data, true);
        io.emit('contact-online', data)
    })
    socket.on('set-offline', data => {
        UserController.changeOnlineStatus(data, false);
        io.emit('contact-offline', data)
    })
    socket.on('disconnect', (data) => {
        console.log('got dc', data)
    })

    RTCMultiConnectionServer.addSocket(socket, {
        config: {
            "socketMessageEvent": "thrive19-message",
            "socketCustomEvent": "thrive19-custom-message",
            "port": port
        }
    })
});

module.exports = io;