import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import framework from '../styles/framework';
import NotFoundImage from "../assets/images/no-data.png"
import { EmptyContentProps } from '../types/components';

const EmptyContent: React.FC<EmptyContentProps> = ({
  message,
  buttonText,
  onButtonPress,
}) => {
  return (
    <View style={[framework.flexCenter, framework.flexOne, framework.py5]}>
      <Text
        style={[
          framework.textCenter,
          framework.fontSemiBold,
          framework.textLg,
          framework.textPrimary,
        ]}
      >
        {message}
      </Text>

      <Image
        source={NotFoundImage}
        style={style.image}
        resizeMode="contain"
      />

      {buttonText && onButtonPress && (
        <TouchableOpacity
          onPress={onButtonPress}
          style={[
            framework.bgPrimary,
            framework.px4,
            framework.py2,
            framework.rounded,
          ]}
        >
          <Text style={[framework.textWhite, framework.textBase]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyContent;

const style = StyleSheet.create({
  image: {
    backgroundColor: "transparent",
    width: 250,
    height: 250,
    marginVertical: 16,
  }
})