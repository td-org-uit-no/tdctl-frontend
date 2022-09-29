// suported sort types
export type SortOption = {
  number: string;
  string: string;
  date: string;
};

export const sortString = (a: string, b: string) => {
  console.log(a);
  return a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1;
};

export const sortNumber = (a: number, b: number) => {
  return a > b ? 1 : -1;
};

export const sortDate = (a: Date, b: Date) => {
  return Number(a) - Number(b);
};

type KeyMap = Record<keyof SortOption, (a: any, b: any) => number>;

export const typeToFunction: KeyMap = {
  number: sortNumber,
  string: sortString,
  date: sortDate,
};
