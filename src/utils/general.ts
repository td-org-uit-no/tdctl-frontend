const dictFromArray = <T>(array: string[], defaultValue: T) => {
  const dict: { [key: string]: T } = {};
  array.forEach((key) => {
    dict[key] = defaultValue;
  });
  return dict;
};

export { dictFromArray };
