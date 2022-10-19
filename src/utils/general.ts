const dictFromArray = <T>(array: string[], defaultValue: T) => {
  const dict: { [key: string]: T } = {};
  array.forEach((key) => {
    dict[key] = defaultValue;
  });
  return dict;
};

const isDeepEqual = (object1: any, object2: any): boolean => {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  let isEqual = true;

  objKeys1.forEach((key) => {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);
    if (isObjects && !isDeepEqual(value1, value2)) {
      isEqual = false;
      return;
    }
    if (!isObjects && value1 !== value2) {
      isEqual = false;
      return;
    }
  });
  return isEqual;
};

const isObject = (object: any) => {
  return object !== null && typeof object === 'object';
};

export { dictFromArray, isDeepEqual };
