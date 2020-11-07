export default interface IEntitiesWrapper {
  getPageCountByParams(
    params: Object,
    entitiesPerPage: number
  ): Promise<Object>;
  getEntitiesByParams(
    params: Object,
    entitiesPerPage: number,
    pageNumber: number
  ): Promise<Object>;
}
