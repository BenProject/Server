export const entityTypes = [
  { type: "אדם", id: "1" },
  { type: "פלאפון", id: "2" },
];

export const entityTypeOntology = [
  {
    id: "1",
    type: "אדם",
    properties: {
      must: [{ age: "number" }, { name: "text" }],
      optional: [{ birthDay: "date" }, { eyeColor: "text" }],
    },
  },
  {
    id: "2",
    type: "פלאפון",
    properties: {
      must: [{ phoneNumber: "text" }, { name: "text" }, { name: "text" }],
      optional: [{ birthDay: "date" }],
    },
  },
];
