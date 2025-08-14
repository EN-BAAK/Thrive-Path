import { DimensionValue } from "react-native";

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