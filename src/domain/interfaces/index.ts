import { Types } from 'mongoose'

export interface IDev {
  name: string,
  user: string,
  bio: string,
  avatar: string,
  isFirstTime: boolean,
  languages: string[],
  likes: Types.ObjectId[],
  dislikes: Types.ObjectId[],
}