export type ResponseApi<T> = {
  count: number;
  next: string;
  previous: string;
  results: T;
};

export type CacheState<T> = {
  data: T;
  timestamp: number;
};
