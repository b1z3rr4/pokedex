export type ResponseApi<T> = {
  count: number;
  next: string;
  previous: string;
  results: T;
}
