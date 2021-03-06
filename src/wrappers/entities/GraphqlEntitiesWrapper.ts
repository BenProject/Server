import request, { gql } from "graphql-request";
import config from "../../../config";
import { JsonToArrayOfJson } from "../../../utils";
import IEntitiesWrapper from "./IEntitiesWrappers";
import { set } from "lodash";
import axios, { AxiosResponse } from "axios";
import { idToEntityName } from "./IEntitiesWrappers";
import Entity from "../../dal/entity";

export default class GraphqlEntitiesWrapper implements IEntitiesWrapper {
  async getSuggestions(
    name: string,
    suggestionsCount: number
  ): Promise<Array<idToEntityName>> {
    try {
      const res: AxiosResponse<any> = await axios.post(
        `${config.elasticIp}/entities/search`,
        {
          name,
          numberOfEntities: suggestionsCount,
        }
      );

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async getPageCountByParams(
    params: Object,
    entitiesPerPage: number
  ): Promise<number> {
    const query = gql`
      query getPageCount($entitiesPerPage: Float!, $Params: JSONObject!) {
        getPagesNumber(Params: $Params, entitiesPerPage: $entitiesPerPage)
      }
    `;
    const variables = {
      entitiesPerPage: entitiesPerPage,
      Params: params,
    };
    try {
      const graphqlRes = await request(config.neo4jOutputIp, query, variables);
      return Promise.resolve(graphqlRes.getPagesNumber);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getEntitiesByParams(
    params: Object,
    entitiesPerPage: number,
    pageNumber: number,
    entityType: string | null = null
  ): Promise<Array<Entity>> {
    const query = gql`
      query getEntities(
        $Params: JSONObject!
        $entitiesPerPage: Float!
        $pageNumber: Float!
        $entityType: String
      ) {
        entities(
          Params: $Params
          entitiesPerPage: $entitiesPerPage
          pageNumber: $pageNumber
          entityType: $entityType
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
      entityType: entityType,
    };

    try {
      let graphqlRes = await request(config.neo4jOutputIp, query, variables);
      graphqlRes.entities.forEach((entity) => set(entity, "id", entity.id.id));
      graphqlRes.entities.map(
        (entity) => (entity.properties = JsonToArrayOfJson(entity.properties))
      );
      return Promise.resolve(graphqlRes.entities);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
