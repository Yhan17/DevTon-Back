import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import http from 'http'
import { Server, Socket } from "socket.io";

const app = express()
const PORT = 3333
app.use(express.json())
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.get('/', (req,res) => {
  return res.json({message: "running"})
})

app.listen(PORT, () => console.log(`🎉 App Running on ${PORT}`))