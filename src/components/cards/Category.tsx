import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardProps } from '../../types/cards';
import { type Category as CategoryType } from '../../types/schemas';
import framework from '../../styles/framework';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Variables from '../../styles/variables';

const CategoryCard: React.FC<CardProps<CategoryType>> = ({ record: cat, onEdit }) => {
  return (
    <TouchableOpacity
      onPress={onEdit}
      style={[framework.card, style.card, framework.mb2, framework.p0, framework.justifyCenter, framework.rounded, framework.relative, framework.overflowHidden]}
    >
      <LinearGradient
        colors={[`${cat.color}`, `${cat.color}99`]}
        style={[style.gradient, framework.w100, framework.h100, framework.absolute, framework.flexOne]}
      />

      <View style={[style.iconBackground, framework.roundedCircle, framework.absolute]} />
      <MaterialCommunityIcons
        name={cat.icon}
        size={150}
        color="rgba(0,0,0,0.4)"
        style={[style.icon, framework.absolute]}
      />

      <View style={[style.textSpace, framework.ml5, framework.pl5]}>
        <Text style={[framework.text2xl, framework.reversedText]}>
          {cat.name}
        </Text>

        <View
          style={[
            style.underline,
            framework.mt3,
            framework.rounded,
            { backgroundColor: Variables.reversedTextColor },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const style = StyleSheet.create({
  card: {
    height: 160,
    shadowOpacity: 0.01,
    shadowOffset: { width: 0, height: 4 },
  },
  gradient: {
    zIndex: 1
  },
  icon: {
    right: -15,
    bottom: -10,
    zIndex: 0
  },
  textSpace: {
    zIndex: 2,
  },
  underline: {
    opacity: 0.6,
    height: 3,
    width: 40,
    zIndex: 2,
  },
  iconBackground: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    height: 180,
    width: 180,
    right: -25,
    bottom: -25,
    zIndex: 0
  }
});
