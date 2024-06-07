// const socketInit = (io) => {
//
//     io.on('connection', (socket) => {
//
//         const user = socket.handshake.auth;
//         console.log('a user connected', user, socket.id);
//
//         socket.join(`room-${user.course}`);
//         //
//         // io.sockets.in('room-'+ user.course);
//
//
//         socket.on('message', ({room, message, senderMobile, id,name}) => {
//             // io.to(room).emit('message', message)
//             io.emit('message', {message, senderMobile, id, name: name})
//             // io.sockets.in(`room-${user.course}`).emit(message);
//
//             console.log('message: ' + room, message, senderMobile, name, id);
//
//         });
//
//         socket.on('disconnect', () => {
//             console.log('user disconnected');
//         });
//     });
// };

const socketInit = (io) => {

    io.on('connection', (socket) => {
        console.log("User connected");

        socket.on('disconnect', function (socket) {
            console.log("user disconnected")
        })
        //join room
        socket.on('join', function (data) {


            socket.join(data.room)

            console.log(data.user + 'joined the room:' + data.room)

            socket.broadcast.to(data.room).emit('new user joined', {user: data.user, message: "has joined this room "});

        });

        socket.on('leave', function (data) {

            console.log(data.user + "has left the room " + data.room)
            socket.broadcast.to(data.room).emit('left room', {user: data.user, message: "has left the room "});
            socket.leave(data.room)

        })
        socket.on('message', function (data) {
            console.log(data)
            io.in(data.room).emit('newMessage', {
                user: data.user,
                message: data.message,
                senderMobile: data.senderMobile,
                userId: data.userId,
                avatar: data.avatar
            })
        })
    });
}

module.exports = {socketInit};