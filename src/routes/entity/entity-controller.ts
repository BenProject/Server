import { request, gql } from "graphql-request";
import config from "../../../config";
import { JsonToArrayOfJson } from "../../../utils";
import { set, differenceWith, isEqual, difference } from "lodash";

export default {
  getEntityPropertiesById: async (req, res) => {
    const query = gql`
      query getEntity($id: String!) {
        entity(id: $id) {
          properties: Properties
          type: EntityType
        }
      }
    `;
    const variables = { id: req.params.id };

    await request(config.neo4jIp, query, variables)
      .then((graphqlRes) => {
        graphqlRes.entity.properties = JsonToArrayOfJson(
          graphqlRes.entity.properties
        );
        res.send(graphqlRes.entity);
      })
      .catch((err) => {
        res.status(400);
        res.send(`couldnt get entityProps ${err}`);
      });
  },

  getEntityRelationById: async (req, res) => {
    const query = gql`
      query getRelations($id: String!, $hopsNumber: Float!) {
        entityRelationsPairs: relations(id: $id, hopsNumber: $hopsNumber) {
          Relations {
            from: StartEntityId {
              id
            }
            to: EndEntityId {
              id
            }
            label: RelType
          }
          Entity {
            EntityType
            Properties
            id: Id
          }
        }
      }
    `;

    const variables = { id: req.params.id, hopsNumber: +req.query.hops };

    await request(config.neo4jIp, query, variables)
      .then((graphqlRes) => {
        graphqlRes.entityRelationsPairs.forEach((entityRelationPair) =>
          entityRelationPair.Relations.forEach((rel) => {
            set(rel, "from", rel.from.id);
            set(rel, "to", rel.to.id);
          })
        );
        res.send({
          edges: graphqlRes.entityRelationsPairs.reduce(
            (total, entityRelationPair) =>
              total.concat(
                differenceWith(entityRelationPair.Relations, total, isEqual)
              ),
            []
          ),

          nodes: graphqlRes.entityRelationsPairs
            .map((entityRelationPair) => {
              return {
                id: entityRelationPair.Entity.id.id,
                label: entityRelationPair.Entity.Properties.name,
              };
            })
            .filter(
              (val, index, arr) =>
                arr.findIndex((t) => t.id === val.id) === index
            ),
        });
      })
      .catch((err) => {
        res.status(400);
        res.send(`couldnt get entityProps ${err}`);
      });
  },
};
