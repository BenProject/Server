import * as express from "express";
import entitiesController from "./entitites-controller";

const router = express.Router();
router.route("/search").post(entitiesController.getEntitiesByParams);

export default router;
