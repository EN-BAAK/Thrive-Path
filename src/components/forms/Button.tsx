import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp, } from 'react-native';
import Variables from '../../styles/variables';
import colors from '../../styles/colors';
import { ButtonProps } from '../../types/forms';

const Button: React.FC<ButtonProps> = ({ msg, variant = 'main', style, textStyle, disabled = false, onPress, ...rest }) => {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    if (disabled) {
      return [styles.base, styles.disabled, style];
    }
    if (variant === 'main-outline') {
      return [styles.base, styles.mainOutline, style];
    }
    return [styles.base, styles.main, style];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    if (disabled) {
      return [styles.text, styles.textDisabled, textStyle];
    }
    if (variant === 'main-outline') {
      return [styles.text, styles.textMainOutline, textStyle];
    }
    return [styles.text, styles.textMain, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...rest}
    >
      <Text style={getTextStyle()}>{msg}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  main: {
    backgroundColor: Variables.mainColor,
    borderColor: Variables.mainColor,
  },
  mainOutline: {
    backgroundColor: 'transparent',
    borderColor: Variables.mainColor,
  },
  disabled: {
    backgroundColor: 'transparent',
    borderColor: colors.secondary,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textMain: {
    color: colors.white,
  },
  textMainOutline: {
    color: Variables.mainColor,
  },
  textDisabled: {
    color: colors.secondary,
  },
});
