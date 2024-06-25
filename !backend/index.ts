import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from 'socket.io';
import cors from 'cors';
import * as DTO from "./models/DTO";
import { Mongo } from "./mongo";
import jwt from 'jsonwebtoken';

dotenv.config();


const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200
};

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(express.json());
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

let userCount = 0;

let messages: { user: string, message: string }[] = [];

let mongo = new Mongo();

function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.get("Authorization")
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const toVerify = token.split(' ')[1];
  const tokenVerified = jwt.verify(toVerify, mongo.jwtSecret);
  next();
}


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScripdt Server");
});

app.get("/usercount", (req: Request, res: Response) => {
  res.json({ userCount });
});

app.get("/user", validateToken, async (req: Request, res: Response) => {
  const token = req.get("Authorization");
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const toVerify = token.split(' ')[1];
  const decodedToken: any = jwt.decode(toVerify);
  if (!decodedToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const data = await mongo.getUserByName(decodedToken.username);
  res.json(data);
});

app.put("/user", validateToken, (req: Request, res: Response) => {
  const token = req.get("Authorization");
  if (!token) {
    res.status(401).json({ error: 'Unauthorized1' });
    return;
  }
  const toVerify = token.split(' ')[1];
  const decodedToken: any = jwt.decode(toVerify);
  if (!decodedToken) {
    res.status(401).json({ error: 'Unauthorized2' });
    return;
  }
  const user: DTO.Login = req.body;
  console.log(user);
  if (user.username !== decodedToken.username) {
    res.status(401).json({ error: 'Unauthorized3' });
    return;
  }
  mongo.UpdateUser(user)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.post("/login", DTO.validateLogin, async (req: Request, res: Response) => {
  const loginData: DTO.Login = req.body;
  const token = await mongo.Login(loginData);
  if (!token) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  res.json({ token });
});

app.post("/register", DTO.validateRegister, (req: Request, res: Response) => {
  const registerData: DTO.Register = req.body;
  registerData.description = "No description provided";
  registerData.twitterhandle = "No twitter handle provided";
  registerData.linkedinhandle = "No linkedin handle provided";
  registerData.githubhandle = "No github handle provided";

  mongo.Register(registerData)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

io.on('connection', (socket) => {
  console.log(socket.id + ' connected');
  userCount++;
  io.emit('user-count', userCount);

  for(let i = 0; i < messages.length; i++){
    socket.emit('new-message', messages[i]);
  }

  socket.on('new-message', (message: { user: string, message: string }) => {
    if(message.message.trim() == "") return;
    console.log(message);
    messages.push(message);
    io.emit('new-message',  { "user": message.user, "message": message.message });
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected');
    userCount--;
    io.emit('user-count', userCount);
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
