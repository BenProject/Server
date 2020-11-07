export const JsonToArrayOfJson = (obj) => {
  return Object.keys(obj).map((k) => ({ [k]: obj[k] }));
};

export const removeDuplicateFromArrayByKey = (array: [], key: string) => {
  return array.filter(
    (val, index, arr) => arr.findIndex((t) => t[key] === val[key]) === index
  );
};
