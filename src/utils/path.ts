// find parent path in url path e.g. /event/something returns event as parent path
export const findParentPath = (path: string): string | undefined => {
  // capture everything between slashes without including the slashes
  const exp = /(?<=\/).+?(?=\/)/;
  const math = path.match(exp);
  return math?.[0];
};
