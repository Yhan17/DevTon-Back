import { DevRepository, DislikeRepository, LikeRepository } from "../../infra/repositories";
import { IDevRepository, ILikeRepository, IDislikeRepository } from "../../domain/repositories";
import { unwrapOccurrences } from '../../domain/occurrences'
import { Request, Response } from 'express';
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function';

export class DevTonController {
  devRepository: IDevRepository
  likeRepository: ILikeRepository
  dislikeRepository: IDislikeRepository

  constructor() {
    this.devRepository = new DevRepository()
    this.dislikeRepository = new DislikeRepository()
    this.likeRepository = new LikeRepository()
    Object.freeze(this)
  }

  async getDevs(req: Request, res: Response): Promise<Response> {
    const { user } = req.headers
    const result = await this.devRepository.getDevs(`${user}`)
    // Colocar isso daqui em uma outra função
    return pipe(result,
      E.fold(
        (e) => res.status(unwrapOccurrences(e).status).json(unwrapOccurrences(e)),
        (r) => res.json(r)
      )
    )
  }

  async registerTechs(req: Request, res: Response): Promise<Response> {
    const { user } = req.headers
    const { techs } = req.body
    const result = await this.devRepository.registerTechs(`${user}`, techs as string[])
    return pipe(result,
      E.fold(
        (e) => res.status(unwrapOccurrences(e).status).json(unwrapOccurrences(e)),
        (r) => res.json(r)
      )
    )
  }

  async storeDev(req: Request, res: Response): Promise<Response> {
    const { username } = req.body;
    if (typeof username != "string") {
      return res.status(500).json({ message: "Attribute is not string" })
    }
    const result = await this.devRepository.storeDev(username)

    return pipe(result,
      E.fold(
        (e) => res.status(unwrapOccurrences(e).status).json(unwrapOccurrences(e)),
        (r) => res.json(r)
      )
    )
  }

  async likeAnDev(req: Request, res: Response): Promise<Response> {
    const { devId } = req.params;
    const { user } = req.headers;

    const result = await this.likeRepository.likeDev(`${user}`, devId, req);


    return pipe(result,
      E.fold(
        (e) => res.status(unwrapOccurrences(e).status).json(unwrapOccurrences(e)),
        (r) => res.json(r)
      )
    )
  }

  async dislikeAnDev(req: Request, res: Response): Promise<Response> {
    const { devId } = req.params;
    const { user } = req.headers;

    const result = await this.dislikeRepository.dislikeDev(`${user}`, devId);

    return pipe(result,
      E.fold(
        (e) => res.status(unwrapOccurrences(e).status).json(unwrapOccurrences(e)),
        (r) => res.json(r)
      )
    )
  }
}