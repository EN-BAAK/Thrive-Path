import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Category as CategoryType } from '../types/schemas';
import { getCategories } from '../api/crud/categories';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import framework from '../styles/framework';
import AddEditCategoryModal from '../components/modals/AddEditCategory';
import { defaultCategory } from '../constants/formValues';
import CategoryCard from '../components/cards/Category';
import FloatingButton from '../components/FloatingButton';
import { FlatList } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native';
import Variables from '../styles/variables';

const Categories: React.FC = (): React.JSX.Element => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('[CATEGORIES] Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      console.error('[CATEGORIES] refresh error', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) return <Loading />;

  if (!categories.length) {
    return (
      <>
        <EmptyContent
          message="There are no categories yet"
          buttonText="Add your first category"
          onButtonPress={() => setSelectedCategory(defaultCategory)}
        />
        {selectedCategory && (
          <AddEditCategoryModal
            visible
            onClose={() => setSelectedCategory(null)}
            onSave={fetchCategories}
            initialCategory={selectedCategory}
          />
        )}
      </>
    );
  }

  return (
    <View style={[framework.bgBackground, framework.flexOne]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[framework.py2]}
        style={[framework.px2]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Variables.mainColor}
          />
        }
        renderItem={({ item }) => (
          <CategoryCard
            record={item}
            onEdit={() => setSelectedCategory(item)}
            onSuccess={fetchCategories}
          />
        )}
      />

      {selectedCategory && (
        <AddEditCategoryModal
          visible
          onClose={() => setSelectedCategory(null)}
          onSave={fetchCategories}
          initialCategory={selectedCategory}
        />
      )}

      <FloatingButton
        msg='+ Add Category'
        action={() => setSelectedCategory(defaultCategory)}
        right={8}
        bottom={8}
      />
    </View>
  );
};

export default Categories;
