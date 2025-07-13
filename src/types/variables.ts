import { TextStyle, ViewStyle } from "react-native";

export interface Condition {
  field: string;
  operator?: '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE';
  value: any;
}

export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle };