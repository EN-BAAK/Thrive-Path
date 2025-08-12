import { TextInputProps, ViewStyle } from "react-native";
import { SelectOption } from "./variables";

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

type FieldProps = {
  name: string,
  label: string,
  placeholder?: string,
  containerStyle?: ViewStyle,
  labelStyle?: ViewStyle,
  required?: boolean
}

export interface InputFieldProps extends FieldProps {
  type?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  inputStyle?: TextInputProps['style'];
  autoComplete?: TextInputProps['autoComplete'];
  multiLine?: boolean,
}

export interface SwitchFieldProps extends FieldProps {
  trackColor: TrackColor,
  thumbColor: ThumbColor
}

export interface DatePickerFieldProps extends FieldProps { }

export interface SelectFieldProps extends FieldProps {
  options: SelectOption[];
  pickerStyle?: any;
}

export interface ColorPickerFieldProps extends FieldProps { }

export interface IconPickerFieldProps extends FieldProps {}