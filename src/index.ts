import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3333
app.use(express.json())
app.use(cors())

