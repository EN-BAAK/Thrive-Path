import React from 'react';
import { View, Text } from 'react-native';
import { Field } from 'formik';
import { Picker } from '@react-native-picker/picker';
import TextError from './TextError';
import framework from '../../styles/framework';
import colors from '../../styles/colors';
import { SelectFieldProps } from '../../types/forms';

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder = 'Select an option',
  options,
  containerStyle,
  labelStyle,
  pickerStyle,
  required = false,
}) => {
  return (
    <View style={[containerStyle]}>
      {label && (
        <Text
          style={[
            framework.mb1,
            framework.fontSemiBold,
            framework.textSm,
            framework.dark,
            labelStyle,
          ]}
        >
          {label}
          {required && ' *'}
        </Text>
      )}

      <Field name={name}>
        {({ field, form, meta }: any) => (
          <>
            <View style={[framework.input, framework.py0, pickerStyle]}>
              <Picker
                selectedValue={field.value}
                onValueChange={(value) => form.setFieldValue(name, value)}
                style={{ color: colors.dark }}
              >
                <Picker.Item label={placeholder} value={undefined} color={colors.gray} />
                {options.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>

            {meta.touched && meta.error && <TextError msg={meta.error} />}
          </>
        )}
      </Field>
    </View>
  );
};

export default SelectField;
