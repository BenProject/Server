import * as express from "express";
import ontologyController from './ontology-controller' 

const router = express.Router();

router.route("/entities/:id").get(ontologyController.getEntityTypeOntology)
router.route('/entities').get(ontologyController.getEntityTypes);

export default router;
