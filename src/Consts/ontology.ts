export const entityTypes = [
  { type: "Person", id: "1" },
  { type: "פלאפון", id: "2" },
];

export const entityTypeOntology = [
  {
    id: "1",
    type: "אדם",
    properties: {
      must: [{ age: "number" }, ],
      optional: [{ birthDay: "date" }, { eyeColor: "text" },{ name: "text" }],
    },
  },
  {
    id: "2",
    type: "פלאפון",
    properties: {
      must: [{ phoneNumber: "text" }, { name: "text" }],
      optional: [{ birthDay: "date" }],
    },
  },
];
