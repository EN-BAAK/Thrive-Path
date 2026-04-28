import React, { useState } from 'react';
import { Category as CategoryType } from '../types/schemas';
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
import { useGetCategories } from '../features/categories';
import { QueryKey } from '../types/variables';
import PageHolder from '../layouts/PageHolder';

const Categories: React.FC = (): React.JSX.Element => {
  const key: QueryKey[] = ["categories"]
  const { data: categories = [], isLoading, isFetching, refetch } = useGetCategories({ key })

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  if (isLoading) return <Loading />;

  if (!categories.length) {
    return (
      <React.Fragment>
        <EmptyContent
          message="There are no categories yet"
          buttonText="Add your first category"
          onButtonPress={() => setSelectedCategory(defaultCategory)}
        />
        {selectedCategory && (
          <AddEditCategoryModal
            visible
            onClose={() => setSelectedCategory(null)}
            queryKey={key}
            initialCategory={selectedCategory}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <PageHolder>
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[framework.py2]}
        style={[framework.px2]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={Variables.mainColor}
          />
          
        }
        renderItem={({ item }) => (
          <CategoryCard
            record={item}
            onEdit={() => setSelectedCategory(item)}
            queryKey={key}
          />
        )}
      />

      {selectedCategory && (
        <AddEditCategoryModal
          visible
          onClose={() => setSelectedCategory(null)}
          queryKey={key}
          initialCategory={selectedCategory}
        />
      )}

      <FloatingButton
        msg='+ Add Category'
        action={() => setSelectedCategory(defaultCategory)}
        right={8}
        bottom={8}
      />
    </PageHolder>
  );
};

export default Categories;
