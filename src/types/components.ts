import { DimensionValue, ViewStyle } from "react-native";
import { QueryKey, ToastMessage, Warning } from "./variables";

export type EmptyContentProps = {
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
};

export interface FloatingButtonProps {
  msg: string,
  action: () => void,
  top?: DimensionValue,
  right?: DimensionValue,
  bottom?: DimensionValue,
  left?: DimensionValue
}

export type CommonParentProps = {
  children: React.ReactNode;
}

export type LoadingElementProps = {
  styles?: ViewStyle[],
  color?: string,
  size?: "large" | "small"
}

export type ToastProps = {
  onClose: () => void;
  toast: ToastMessage
};

export type WarningProps = {
  onClose: () => void,
  warning: Warning
}

export type ItemFlatListProps<T, A> = {
  items: T[],
  isFetching: boolean,
  fetchNextPage: () => void,
  hasNextPage: boolean,
  queryKey: QueryKey[],
  setSelectedItem: React.Dispatch<React.SetStateAction<A | null>>
  onRefetch: () => void
}