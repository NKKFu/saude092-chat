var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {

    socket.on('JoinRoom', (arg1) => {

        // É admin
        if (arg1) {
            for (let i = 0; true; i++) {
                if (!roomsList.rooms["room-" + i]) {
                    socket.join("room-" + i);
                    socket.emit('connectToRoom', i);
                    break;
                }
            }
        } else {
            for (let i = 0; true && i < 100; i++) {
                if (roomsList.rooms["room-" + i] && roomsList.rooms["room-" + i].length == 1) {
                    socket.join("room-" + i);
                    socket.emit('connectToRoom', i);
                    return;
                }
            }
            socket.emit('errorToJoin');
        }
    });

    socket.on('messageToServer', (author, roomID, msg) => {
        socket.to("room-" + roomID).emit('message', author, msg)
    });

    socket.on('CancelToServer', (roomID) => {
        socket.to("room-" + roomID).emit('cancel')
    });

    const roomsList = io.nsps['/'].adapter;
});



http.listen(process.env.PORT || 3000);