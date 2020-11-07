import * as express from "express";
import entityController from "./entity-controller";

const router = express.Router();
router.route("/:id/properties").get(entityController.getEntityPropertiesById);
router.route("/:id/relations").get(entityController.getEntityRelationById);

export default router;
