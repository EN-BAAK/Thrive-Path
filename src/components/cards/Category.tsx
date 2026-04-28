import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardProps } from '../../types/cards';
import { type Category as CategoryType } from '../../types/schemas';
import framework from '../../styles/framework';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Variables from '../../styles/variables';
import { useDeleteCategory } from '../../features/categories';
import { Swipeable } from 'react-native-gesture-handler';
import { useAppContext } from '../../contexts/AppProvider';

const CategoryCard: React.FC<CardProps<CategoryType>> = ({ record: cat, onEdit, queryKey: key }) => {
  const { mutateAsync } = useDeleteCategory({ key })
  const { showWarning } = useAppContext()
  const swipeRef = useRef<Swipeable>(null);

  const handleDelete = async () => {
    showWarning({
      btn2: "delete",
      btn1: "cancel",
      handleBtn2: async () => await mutateAsync(cat.id),
      handleBtn1: () => {swipeRef.current?.close()},
      message: `Are you sure you want to delete the category "${cat.name}"?`
    })
  }

  const renderRightActions = () => (
    <View style={[framework.flexCenter]}>
      <View style={[framework.bgDanger, framework.p4, framework.roundedMd]}>
        <MaterialCommunityIcons name="delete" size={28} color="#fff" />
        <Text style={[framework.reversedText, framework.mt2, framework.textXs]}>Delete</Text>
      </View>
    </View>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleDelete}
      friction={2}
      rightThreshold={80}
      overshootRight={false}
    >
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
    </Swipeable>
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
  },
  deleteText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
  }
});
