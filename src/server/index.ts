import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import http from 'http'
import { Server, Socket } from "socket.io";
import config from '../config/config';
import { routes } from './routes';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
const app = express()
const PORT = 3333

const httpServer = http.createServer(app)
const io = new Server(httpServer)


const connectedUsers: Record<string, string> = {}

declare global {
  namespace Express {
    interface Request {
      io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
      connectedUsers: Record<string, string>;
    }
  }
}

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user as string] = socket.id;
})


app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
})

mongoose.connect(config.mongo.url, config.mongo.options, () => console.log('🎲 connected to database'))

app.use(express.json())
app.use(cors())
app.use(routes)
app.listen(process.env.PORT || PORT, () => console.log(`🎉 App Running on ${PORT}`))