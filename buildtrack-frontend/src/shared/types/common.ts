export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  lastEvaluatedKey?: string;
}
