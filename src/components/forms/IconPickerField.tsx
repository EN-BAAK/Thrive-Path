import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Field } from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import framework from '../../styles/framework';
import TextError from './TextError';
import { IconPickerFieldProps } from '../../types/forms';
import { iconList } from '../../misc/global';
import Variables from '../../styles/variables';

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

const IconPickerField: React.FC<IconPickerFieldProps> = ({
  name,
  label,
  required = false,
  containerStyle,
  labelStyle
}) => {

  return (
    <Field name={name}>
      {({ field, form, meta }: any) => (
        <View style={containerStyle}>
          {label && (
            <Text
              style={[framework.mb1, framework.fontSemiBold, framework.textSm, labelStyle]}
            >
              {label}
              {required && ' *'}
            </Text>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[framework.py1, framework.flexRow, framework.gap1]}
          >
            {chunkArray(iconList, 2).map((column, colIndex) => (
              <View
                key={colIndex}
                style={[framework.flexColumn, framework.gap1]}
              >
                {column.map((iconName) => {
                  const isSelected = field.value === iconName;
                  return (
                    <TouchableOpacity
                      key={iconName}
                      style={[styles.iconWrapper, framework.bgSecond, framework.flexCenter, framework.rounded, framework.border1, framework.borderSecondary,
                      isSelected && [framework.bgLightMain]
                      ]}
                      onPress={() => {
                        form.setFieldValue(name, iconName);
                      }}
                    >
                      <MaterialCommunityIcons
                        name={iconName}
                        size={22}
                        color={isSelected ? Variables.mainColor : Variables.reversedTextColor}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {meta.touched && meta.error && <TextError msg={meta.error} />}
        </View>
      )}
    </Field>
  );
};

export default IconPickerField;

const styles = StyleSheet.create({
  iconWrapper: {
    width: 35,
    height: 35,
  },
});
