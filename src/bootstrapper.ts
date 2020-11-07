import GraphqlEntitiesWrapper from "./wrappers/entities/GraphqlEntitiesWrapper";
import IEntitiesWrapper from "./wrappers/entities/IEntitiesWrappers";
import GraphqlEntityWrapper from "./wrappers/entity/GraphqlEntityWrapper";
import IEntityWrapper from "./wrappers/entity/IEntityWrapper";

export const entityWrapper: IEntityWrapper = new GraphqlEntityWrapper();
export const entitiesWrapper: IEntitiesWrapper = new GraphqlEntitiesWrapper();
