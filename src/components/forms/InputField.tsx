import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Field } from 'formik';
import TextError from './TextError';
import { InputFieldProps } from '../../types/forms';
import framework from '../../styles/framework';
import colors from '../../styles/colors';

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  type = 'default',
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  labelStyle,
  autoComplete = 'off',
  multiLine = false,
  required = false,
}) => {
  return (
    <View style={[containerStyle]}>
      {label &&
        <Text style={[framework.mb1, framework.fontSemiBold, framework.textSm, framework.dark, labelStyle]}>
          {label}
          {required && " *"}
        </Text>}

      <Field name={name}>
        {({ field, meta }: any) => (
          <>
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={colors.gray}
              style={[framework.input, multiLine && framework.textArea, inputStyle]}
              keyboardType={type}
              secureTextEntry={secureTextEntry}
              value={field.value?.toString() ?? ""}
              onChangeText={field.onChange(name)}
              onBlur={field.onBlur(name)}
              autoComplete={autoComplete}
              multiline={multiLine}
            />

            {meta.touched && meta.error && <TextError msg={meta.error} />}
          </>
        )}
      </Field>
    </View>
  );
};

export default InputField;
