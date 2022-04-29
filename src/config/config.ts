import dotenv from 'dotenv'
import {ConnectOptions} from 'mongoose'

dotenv.config()

// Mongo DB cluster config
const MONGO_OPTIONS : ConnectOptions = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  autoIndex: false,
  retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USER || 'superuser';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'supersecretpassword';
const MONGO_HOST = process.env.MONGO_URL || 'localhost';


const MONGO = {
  url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}?retryWrites=true&w=majority`,
  options: MONGO_OPTIONS
} as const

const config = {
  mongo: MONGO
}

export default config