export default interface IEntityWrapper {
  getEntityPropertiesById(id: string): Promise<Object>;
  getEntityRelationById(id: string, hopsNumber: number): Promise<Object>;
  createEntity(properties:Object,entityType:string): Promise<string>;
}
