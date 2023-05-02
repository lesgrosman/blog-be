export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type Nullable<T> = T | null;

export type SortInput = {
  sortBy: string;
  order: OrderEnum;
};

export type Pagination = {
  limit: number;
  offset: number;
  count: number;
};
