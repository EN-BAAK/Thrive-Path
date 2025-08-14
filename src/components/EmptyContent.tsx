import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import framework from '../styles/framework';
import NotFoundImage from "../assets/images/no-data.png"
import { EmptyContentProps } from '../types/components';
import Button from './forms/Button';

const EmptyContent: React.FC<EmptyContentProps> = ({
  message,
  buttonText,
  onButtonPress,
}) => {
  return (
    <View style={[framework.flexOne, framework.py5, framework.flexCenter]}>
      <Text style={[framework.textCapitalize, framework.textCenter, framework.fontSemiBold, framework.textLg, framework.textMain,]}
      >
        {message}
      </Text>

      <Image
        source={NotFoundImage}
        style={style.image}
        resizeMode="contain"
      />

      {
        buttonText && onButtonPress && (
          <Button
            msg={buttonText}
          />
        )
      }
    </View >
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