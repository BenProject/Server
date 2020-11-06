import { request, gql } from "graphql-request";
import config from "../../../config";
import { set, mapValues } from "lodash";
import { JsonToArrayOfJson } from "../../../utils";

export default {
  getEntityInsights: async (req, res) => {},

  getEntitiesByParams: async (req, res) => {
    const { pageNumber, entitiesPerPage, params } = req.body;

    const query = gql`
      query getEntities(
        $Params: JSONObject!
        $entitiesPerPage: Float!
        $pageNumber: Float!
      ) {
        entities(
          Params: $Params
          entitiesPerPage: $entitiesPerPage
          pageNumber: $pageNumber
        ) {
          properties: Properties
          type: EntityType
          id: Id
        }
      }
    `;

    const variables = {
      pageNumber: pageNumber,
      entitiesPerPage: entitiesPerPage,
      Params: params,
    };

    await request(config.neo4jIp, query, variables)
      .then((graphqlRes) => {
        graphqlRes.entities.forEach((entity) =>
          set(entity, "id", entity.id.id)
        );
        graphqlRes.entities.map(
          (entity) => (entity.properties = JsonToArrayOfJson(entity.properties))
        );

        res.send(graphqlRes.entities);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  },
};
