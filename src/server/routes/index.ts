import { Router } from "express";
import { DevTonController } from "../controllers";

const routes = Router()
const controller = new DevTonController()

routes.get("/", (req, res) => res.json({ message: "running" }))

routes.get('/devs', (req, res) => controller.getDevs(req, res));
routes.post('/devs', (req, res) => controller.storeDev(req, res));
routes.post('/devs/:devId/likes', (req, res) => controller.likeAnDev(req, res));
routes.post('/devs/:devId/dislikes', (req, res) => controller.dislikeAnDev(req, res));

export { routes }