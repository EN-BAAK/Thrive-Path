import { InfiniteData } from "@tanstack/react-query";
import { TextStyle, ViewStyle } from "react-native";

export enum ToastMessageType {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export type Operation = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'LIKE' | 'IN' | "IS";
type JoinTypes = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
export enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export enum RepeatInterval {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM"
}

export type ToastMessage = {
  message: string;
  type: ToastMessageType;
  title?: string
};

export type Warning = {
  message: string;
  btn1?: string;
  btn2: string;
  handleBtn2: () => void;
  handleBtn1?: () => void
};

export type QueryKey = string | number

export type OffsetUnit = Record<QueryKey, any>
export enum UpdateOffsetUnitProcess {
  UP = "UP",
  DOWN = "DOWN"
}

export interface Condition {
  table?: string;
  field: string;
  operator?: Operation
  value: any;
}

export type PaginatedResult<T> = {
  data: T[];
  count: number;
  limit: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type InfiniteAPIResponse<T> =
  InfiniteData<PaginatedResult<T>>;

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

export type Pagination = {
  limit?: number,
  offsetUnit?: number
  page?: number
}

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

export type TaskData = {
  endAt: number;
  onTick?: (msLeft: number) => void;
};