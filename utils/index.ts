export const JsonToArrayOfJson = (obj) => {
    return Object.keys(obj).map((k) => ({ [k]: obj[k] }));
  };