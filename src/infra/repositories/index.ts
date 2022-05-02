import { Either, left, right } from "fp-ts/lib/Either";
import { IDev } from "../../domain/interfaces";
import { Occurrences } from "../../domain/occurrences";
import { IDevRepository, IDislikeRepository, ILikeRepository } from "../../domain/repositories";
import DevSchema from "../schema";
import axios from "axios";

import { Request } from 'express'

export class DevRepository implements IDevRepository {
  async registerTechs(userId: string, techs: string[],req: Request): Promise<Either<Occurrences, IDev>> {
    try {
      const loggedUser = await DevSchema.findById(userId);
      if (!loggedUser) {
        return left<Occurrences, IDev>(Occurrences.DatabaseError)
      }
      loggedUser.languages.push(...techs)
      loggedUser.isFirstTime = false
      await loggedUser.save()
      req.io.emit('newUser', null)
      return right<Occurrences, IDev>(loggedUser)
    } catch(e) {
      console.log(e)
      return left<Occurrences, IDev>(Occurrences.ServerError)

    }
  }
  async getDevs(userId: string): Promise<Either<Occurrences, IDev[]>> {
    try {
      const loggedUser = await DevSchema.findById(userId);
      const users = await DevSchema.find({
        $and: [
          {
            languages: {
              $in: loggedUser.languages
            }
          },
          {
            _id: { $ne: userId }
          },
          {
            _id: { $nin: loggedUser.likes }
          },
          {
            _id: { $nin: loggedUser.dislikes }
          },
        ],
      })
      return right<Occurrences, IDev[]>(users);
    } catch {
      return left<Occurrences, IDev[]>(Occurrences.DatabaseError)
    }
  }

  async storeDev(username: string): Promise<Either<Occurrences, IDev>> {
    try {
      const userExists = await DevSchema.findOne({ user: username });

      if (userExists) {
        return right<Occurrences, IDev>(userExists)
      }
      const response = await axios.get(`https://api.github.com/users/${username}`)
      const { name, bio, avatar_url: avatar } = response.data;

      const dev = await DevSchema.create({
        name,
        user: username,
        bio,
        avatar
      });

      return right<Occurrences, IDev>(dev)
    } catch {
      return left<Occurrences, IDev>(Occurrences.DatabaseError)
    }
  }
}

export class DislikeRepository implements IDislikeRepository {
  async dislikeDev(userId: string, targetId: string): Promise<Either<Occurrences, IDev>> {
    try {
      const loggedDev = await DevSchema.findById(userId);
      const targetDev = await DevSchema.findById(targetId);

      if (!targetDev) {
        return left<Occurrences, IDev>(Occurrences.ServerError)
      }
      loggedDev.dislikes.push(targetDev._id);

      await loggedDev.save();

      return right<Occurrences, IDev>(loggedDev);
    } catch {
      return left<Occurrences, IDev>(Occurrences.DatabaseError)
    }
  }
}

export class LikeRepository implements ILikeRepository {
  async likeDev(userId: string, targetId: string, req: Request): Promise<Either<Occurrences, IDev>> {
    try {

      const loggedDev = await DevSchema.findById(userId);
      const targetDev = await DevSchema.findById(targetId);

      if (!targetDev) {
        return left<Occurrences, IDev>(Occurrences.ServerError)
      }

      if (targetDev.likes.includes(loggedDev._id)) {
        const loggedSocket = req.connectedUsers[userId];
        const targetSocket = req.connectedUsers[targetId];
        if (loggedSocket) {
          req.io.to(loggedSocket).emit('match', targetDev)
        }
        if (targetSocket) {
          req.io.to(targetSocket).emit('match', loggedDev)
        }
      }
      loggedDev.likes.push(targetDev._id);

      await loggedDev.save();

      return right<Occurrences, IDev>(loggedDev);
    } catch {
      return left<Occurrences, IDev>(Occurrences.DatabaseError)
    }
  }

}