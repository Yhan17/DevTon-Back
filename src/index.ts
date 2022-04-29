import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import http from 'http'
import { Server, Socket } from "socket.io";
import config from './config/config';

const app = express()
const PORT = 3333
app.use(express.json())
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer)

mongoose.connect(config.mongo.url, config.mongo.options)

app.get('/', (req, res) => {
  return res.json({ message: "running" })
})

app.listen(PORT, () => console.log(`🎉 App Running on ${PORT}`))