import * as express from "express";
import entitiesController from "./entitites-controller";

const router = express.Router();
router.route("/search").post(entitiesController.getEntitiesByParams);
router.route("/pageCount").post(entitiesController.getPageCountByParams)
router.route('/suggestions').post(entitiesController.getSuggestions)
export default router;
