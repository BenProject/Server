import GraphqlEntityWrapper from "./wrappers/entity/GraphqlEntityWrapper";
import IEntityWrapper from "./wrappers/entity/IEntityWrapper";

export const entityWrapper: IEntityWrapper = new GraphqlEntityWrapper();
