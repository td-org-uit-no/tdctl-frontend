// suported sort types
export type SortOption = {
  number: string;
  string: string;
  date: string;
  bool: boolean;
};

export const sortString = (a: string, b: string) => {
  return a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1;
};

export const sortNumber = (a: number, b: number) => {
  return a > b ? 1 : -1;
};

export const sortDate = (a: Date, b: Date) => {
  return Number(a) - Number(b);
};

export const sortBoolean = (a: boolean, b: boolean) => {
  return a > b ? 1 : -1;
};

type KeyMap = Record<keyof SortOption, (a: any, b: any) => number>;

export const typeToFunction: KeyMap = {
  number: sortNumber,
  string: sortString,
  date: sortDate,
  bool: sortBoolean,
};
