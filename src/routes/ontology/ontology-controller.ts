import { entityTypes, entityTypeOntology } from "../../consts/ontology";

export default {
  getEntityTypes: (req, res) => {
    res.send(entityTypes);
  },

  getEntityTypeOntology: (req, res) => {
    const ontolgyId = req.params.id;
    res.send(entityTypeOntology.find((type) => type.id === ontolgyId));
  },
};
