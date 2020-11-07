import { request, gql } from "graphql-request";
import config from "../../../config";
import { set,isEmpty } from "lodash";
import { JsonToArrayOfJson } from "../../../utils";

export default {
  getEntityInsights: async (req, res) => {},

  getPageCountByParams: async (req, res) => {
    const { entitiesPerPage, params } = req.body;

    if (!params || !entitiesPerPage) {
      res.status(400);
      return res.send("didnt provided all must be args");
    }

    const query = gql`
      query getPageCount($entitiesPerPage: Float!, $Params: JSONObject!) {
        getPagesNumber(Params: $Params, entitiesPerPage: $entitiesPerPage)
      }
    `;
    const variables = {
      entitiesPerPage: entitiesPerPage,
      Params: params,
    };

    await request(config.neo4jIp, query, variables)
      .then((graphqlRes) => {
        res.send({ pageCount: graphqlRes.getPagesNumber });
      })
      .catch((err) => {
        res.status(400);
        res.send(`couldnt get pageCount ${err}`);
      });
  },

  getEntitiesByParams: async (req, res) => {
    const { pageNumber, entitiesPerPage, params } = req.body;

    if (!params || !entitiesPerPage || !pageNumber|| isEmpty(params)) {
      res.status(400);
      return res.send("didnt provided all must be args");
    }

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
