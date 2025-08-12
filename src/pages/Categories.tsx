import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { Category as CategoryType } from '../types/schemas';
import { getCategories } from '../api/crud/categories';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import framework from '../styles/framework';
import AddEditCategoryModal from '../components/modals/AddEditCategory';
import { defaultCategory } from '../constants/formValues';
import CategoryCard from '../components/cards/Category';

const Categories: React.FC = (): React.JSX.Element => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <ScrollView
        style={[framework.px2]}
        contentContainerStyle={[framework.py2]}
      >
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            record={cat}
            onEdit={() => setSelectedCategory(cat)}
            onSuccess={fetchCategories}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[framework.bgMain, framework.px4, framework.py2, framework.rounded, framework.absolute, framework.bottom1, framework.right1,]}
        onPress={() => setSelectedCategory(defaultCategory)}
      >
        <Text style={[framework.reversedText, framework.fontBold]}>
          + Add Category
        </Text>
      </TouchableOpacity>

      {selectedCategory && (
        <AddEditCategoryModal
          visible
          onClose={() => setSelectedCategory(null)}
          onSave={fetchCategories}
          initialCategory={selectedCategory}
        />
      )}
    </View>
  );
};

export default Categories;
