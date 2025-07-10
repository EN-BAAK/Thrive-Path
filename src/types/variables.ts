export interface Condition {
  field: string;
  operator?: '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE';
  value: any;
}