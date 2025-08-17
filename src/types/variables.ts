import { TextStyle, ViewStyle } from "react-native";

type Operation = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE';
type JoinTypes = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
export enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}
export enum HabitType {
  GOOD = "GOOD",
  BAD = "BAD"
}
export enum RepeatInterval {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM"
}

export interface Condition {
  table?: string;
  field: string;
  operator?: Operation
  value: any;
}

export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle };

export type JoinInput = {
  through: string;
  as?: string;
  on: string;
  type?: JoinTypes;
  columns?: ColumnSelection[];
};

export type ColumnSelection = {
  column: string;
  alias?: string;
};

export type SelectOption = {
  label: string;
  value: any;
};

export type ThemeColors = {
  mainColor: string;
  lightMain: string,
  secondColor: string;
  backgroundColor: string;
  textColor: string;
  reversedTextColor: string
};

export type ButtonVariant = 'main' | 'main-outline';

export type IdentifyEntity = {
  id: number,
  name: string,
}