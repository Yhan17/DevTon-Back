import { Either } from "fp-ts/lib/Either";
import { IDev } from "../interfaces";
import { Occurrences } from "../occurrences";
import { Request } from "express";

export interface IDevRepository {
  getDevs: (userId: string) => Promise<Either<Occurrences, IDev[]>>
  storeDev: (username: string) => Promise<Either<Occurrences, IDev>>
  registerTechs: (userId: string, techs: string[], req: Request) => Promise<Either<Occurrences, IDev>>
}

export interface ILikeRepository {
  likeDev: (userId: string, targetId: string, req: Request) => Promise<Either<Occurrences, IDev>>
  getLikedDevs: (userId: string) =>  Promise<Either<Occurrences, IDev[]>>
}

export interface IDislikeRepository {
  dislikeDev: (userId: string, targetId: string) => Promise<Either<Occurrences, IDev>>
  getDislikedDevs: (userId: string) =>  Promise<Either<Occurrences, IDev[]>>
}