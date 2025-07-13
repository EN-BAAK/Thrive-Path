import { TextInputProps, ViewStyle } from "react-native";

export type TrackColor = {
  true: string,
  false: string
}

export type ThumbColor = {
  true: string,
  false: string
}

export type TextErrorProps = {
  msg: string
}

export interface InputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextInputProps['style'];
  labelStyle?: ViewStyle;
  autoComplete?: TextInputProps['autoComplete'];
  multiLine?: boolean,
  required?: boolean
}

export interface SwitchFieldProps {
  name: string;
  label?: string;
  containerStyle?: object;
  labelStyle?: object;
  trackColor: TrackColor,
  thumbColor: ThumbColor
}

export interface DatePickerFieldProps {
  name: string;
  label?: string;
  containerStyle?: object;
  labelStyle?: object;
  required?: boolean;
}