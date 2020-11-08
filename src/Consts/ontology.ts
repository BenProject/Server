export const entityTypes = [
  { type: "Person", id: "1" },
  { type: "Phone", id: "2" },
];

export const entityTypeOntology = [
  {
    id: "1",
    type: "Person",
    properties: {
      must: [{ age: "number" }, ],
      optional: [{ birthDay: "date" }, { eyeColor: "text" },{ name: "text" }],
    },
  },
  {
    id: "2",
    type: "Phone",
    properties: {
      must: [{ phoneNumber: "text" }, { name: "text" }],
      optional: [{ birthDay: "date" }],
    },
  },
];
