const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', socket => {
    console.log('New WS connection...');

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    // broadcast to everyone
    io.emit();

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

    // listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    });



});




const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
