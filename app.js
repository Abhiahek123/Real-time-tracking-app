const express = require('express');
const app = express();
const path = require('path');

// socketio.io setup
const http = require('http');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// ejs setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket)  {
    socket.on('send-location', function (data) {
        io.emit("receive-location", {id: socket.id, ...data});
    });
    socket.on('disconnect', function () {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", function (req, res) {
    res.render("index");
});

// ← CHANGE: use Render's PORT env variable (fallback to 3000 locally)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
