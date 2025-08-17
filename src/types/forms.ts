import React from "react";
import { StyleProp, TextInputProps, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { ButtonVariant, SelectOption } from "./variables";
import { GestureResponderEvent } from "react-native";

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
  required?: boolean,
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
  disabled?: boolean
}

export interface ColorPickerFieldProps extends FieldProps { }

export interface IconPickerFieldProps extends FieldProps { }

export type ButtonProps = {
  msg: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
} & Omit<React.ComponentProps<typeof TouchableOpacity>, 'style' | 'onPress'>;