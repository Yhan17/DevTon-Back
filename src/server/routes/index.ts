import { Router } from "express";
import { DevTonController } from "../controllers";

const routes = Router()
const controller = new DevTonController()

routes.get("/", (req, res) => res.json({ message: "running" }))

routes.get('/devs', (req, res) => controller.getDevs(req, res));
routes.post('/dev', (req, res) => controller.storeDev(req, res));
routes.post('/dev/techs', (req, res) => controller.registerTechs(req, res));
routes.post('/devs/:devId/likes', (req, res) => controller.likeAnDev(req, res));
routes.post('/devs/:devId/dislikes', (req, res) => controller.dislikeAnDev(req, res));
routes.get('/devs/likes', (req, res) => controller.getLikedDevs(req, res));
routes.get('/devs/dislikes', (req, res) => controller.getDislikedDevs(req, res));

export { routes }