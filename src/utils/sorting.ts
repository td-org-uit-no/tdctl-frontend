// suported sort types
export type SortOption = {
  number: string;
  string: string;
  date: string;
  bool: boolean;
};

export const sortString = new Intl.Collator('nb').compare;

export const sortNumber = (a: number, b: number) => a - b;

export const sortDate = (a: Date, b: Date) => {
  return Number(a) - Number(b);
};

export const sortBoolean = (a: boolean, b: boolean) => Number(a) - Number(b);

type KeyMap = Record<keyof SortOption, (a: any, b: any) => number>;

export const typeToFunction: KeyMap = {
  number: sortNumber,
  string: sortString,
  date: sortDate,
  bool: sortBoolean,
};
