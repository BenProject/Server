import request, { gql } from "graphql-request";
import config from "../../../config";
import {
  JsonToArrayOfJson,
  removeDuplicateFromArrayByKey,
} from "../../../utils";
import IEntityWrapper from "./IEntityWrapper";
import { set, differenceWith, isEqual } from "lodash";

export default class GraphqlEntityWrapper implements IEntityWrapper {
  async getEntityRelationById(id: string, hopsNumber: number): Promise<Object> {
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
    const variables = { id: id, hopsNumber: hopsNumber };
    try {
      let graphqlRes = await request(config.neo4jIp, query, variables);
      graphqlRes.entityRelationsPairs.forEach((entityRelationPair) =>
        entityRelationPair.Relations.forEach((rel) => {
          set(rel, "from", rel.from.id);
          set(rel, "to", rel.to.id);
        })
      );

      return Promise.resolve({
        edges: graphqlRes.entityRelationsPairs.reduce(
          (total, entityRelationPair) =>
            total.concat(
              differenceWith(entityRelationPair.Relations, total, isEqual)
            ),
          []
        ),

        nodes: removeDuplicateFromArrayByKey(
          graphqlRes.entityRelationsPairs.map((entityRelationPair) => {
            return {
              id: entityRelationPair.Entity.id.id,
              //TODO: more generic than alawys look at Properties.name
              label: entityRelationPair.Entity.Properties.name,
            };
          }),
          "id"
        ),
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getEntityPropertiesById(id: string): Promise<Object> {
    const query = gql`
      query getEntity($id: String!) {
        entity(id: $id) {
          properties: Properties
          type: EntityType
        }
      }
    `;
    const variables = { id: id };
    try {
      let graphqlRes = await request(config.neo4jIp, query, variables);
      graphqlRes.entity.properties = JsonToArrayOfJson(
        graphqlRes.entity.properties
      );
      return Promise.resolve(graphqlRes.entity.properties);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
