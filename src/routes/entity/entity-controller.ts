import { entityWrapper } from "../../bootstrapper";

export default {
  getEntityPropertiesById: async (req, res) => {
    try {
      res.send({
        properties: await entityWrapper.getEntityPropertiesById(req.params.id),
      });
    } catch (err) {
      res.status(500);
      res.send(`error while trying to getEntityPropertiesById, err: ${err}`);
    }
  },

  getEntityRelationById: async (req, res) => {
    try {
      res.send(
        await entityWrapper.getEntityRelationById(
          req.params.id,
          +req.query.hops
        )
      );
    } catch (err) {
      res.status(500);
      res.send(`error while trying to getEntitiesRelationById, err: ${err}`);
    }
  },
  createEntity: async (req, res) => {
    const { properties, type } = req.body;
    try {
      res.send({ id: await entityWrapper.createEntity(properties, type) });
    } catch (err) {
      res.status(500);
      res.send(`error while trying to create entity ${err}`);
    }
  },
};
