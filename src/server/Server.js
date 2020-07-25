import http from 'http'
import express from 'express'
import socketio from 'socket.io'
import moment from 'moment';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`> Server listening on port: 3000`)
})

app.use(express.static('src/client', {index: "html/main.html"}));

io.on('connection', (socket) => {
    const playerId = socket.id;
    console.log(`> Player connected: ${playerId}`);

    socket.on('sendMessage', (message) => {
        message.date = moment().format("DD/MM[-]HH[:]m").toString();
        socket.broadcast.emit('newMessage', message);
        //socket.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${playerId}`)
    })
})
