export default interface IEntitiesWrapper {
  getPageCountByParams(
    params: Object,
    entitiesPerPage: number
  ): Promise<number>;
  getEntitiesByParams(
    params: Object,
    entitiesPerPage: number,
    pageNumber: number,
    entityType: string | null
  ): Promise<Array<Object>>;
  getSuggestions(
    name: string,
    suggestionsCount: number
  ): Promise<Array<idToEntityName>>;
}

export interface idToEntityName {
  id: string;
  name: string;
}
