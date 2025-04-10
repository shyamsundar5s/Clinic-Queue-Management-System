const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(username);
    io.to(roomId).emit('message', `${username} has joined the room.`);
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('message', message);
  });
});

app.get('/', (req, res) => {
  res.send('Chatroom Server Running');
});

server.listen(4000, () => console.log('Chatroom running on port 4000'));
