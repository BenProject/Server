import request, { gql } from "graphql-request";
import config from "../../../config";
import {
  JsonToArrayOfJson,
  removeDuplicateFromArrayByKey,
} from "../../../utils";
import IEntityWrapper from "./IEntityWrapper";
import { set, differenceWith, isEqual } from "lodash";
import axios, { AxiosResponse } from "axios";

export default class GraphqlEntityWrapper implements IEntityWrapper {
  async createEntity(properties: Object, entityType: string): Promise<string> {
    try {
      const neo4jRes: AxiosResponse<any> = await axios.post(
        `${config.neo4jInputIp}/entity`,
        {
          entity: {
            properties,
            type: entityType,
          },
        }
      );
      if (!neo4jRes || !neo4jRes.data.id) {
        return Promise.reject("problem while sending request to dal");
      }

      try {
        if (properties["name"]) {
          await axios.post(`${config.elasticIp}/entities`, {
            name: properties["name"],
            id: neo4jRes.data.id,
          });
        }
      } catch (err) {
        console.log(err);
      }

      return Promise.resolve(neo4jRes.data.id);
    } catch (err) {
      return Promise.reject(err);
    }
  }
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
      let graphqlRes = await request(config.neo4jOutputIp, query, variables);
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
            let labelKey = "";
            for (let key of config.neo4jOptionalLabelKey) {
              if (entityRelationPair.Entity.Properties[key]) {
                labelKey = key;
                break;
              }
            }

            return {
              id: entityRelationPair.Entity.id.id,
              label: entityRelationPair.Entity.Properties[labelKey].toString(),
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
      let graphqlRes = await request(config.neo4jOutputIp, query, variables);
      graphqlRes.entity.properties = JsonToArrayOfJson(
        graphqlRes.entity.properties
      );
      return Promise.resolve(graphqlRes.entity.properties);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
