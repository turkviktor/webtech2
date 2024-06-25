"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const corsOptions = {
    origin: 'http://167.86.90.166:4200',
    optionsSuccessStatus: 200
};
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://167.86.90.166:4200",
        methods: ["GET", "POST"]
    }
});
app.use((0, cors_1.default)(corsOptions));
const port = process.env.PORT || 3000;
let userCount = 0;
let messages = [];
app.get("/", (req, res) => {
    res.send("Express + TypeScripdt Server");
});
app.get("/usercount", (req, res) => {
    res.json({ userCount });
});
io.on('connection', (socket) => {
    console.log(socket.id + ' connected');
    userCount++;
    io.emit('user-count', userCount);
    for (let i = 0; i < messages.length; i++) {
        socket.emit('new-message', messages[i]);
    }
    socket.on('new-message', (message) => {
        if (message.message.trim() == "")
            return;
        console.log(message);
        messages.push(message);
        io.emit('new-message', { "user": message.user, "message": message.message });
    });
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
        userCount--;
        io.emit('user-count', userCount);
    });
});
server.listen(port, () => {
    console.log(`[server]: Server is running at http://167.86.90.166:${port}`);
});
