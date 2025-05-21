import React from 'react';
import {   useWindowDimensions,View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from "@/constants/theme/useTheme";
const categories = [
  { id: 1, name: 'Fiestas', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSt7FxHcICKJa2SPXdjsUDAv5WTFqXXgdTNw&s' },
  { id: 2, name: 'Conciertos', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSt7FxHcICKJa2SPXdjsUDAv5WTFqXXgdTNw&s' },
  { id: 3, name: 'Culturales', imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSt7FxHcICKJa2SPXdjsUDAv5WTFqXXgdTNw&s'" },
  { id: 1, name: 'Fiestas', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSt7FxHcICKJa2SPXdjsUDAv5WTFqXXgdTNw&s' },
  { id: 2, name: 'Conciertos', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSt7FxHcICKJa2SPXdjsUDAv5WTFqXXgdTNw&s' },
  { id: 3, name: 'Culturales', imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSt7FxHcICKJa2SPXdjsUDAv5WTFqXXgdTNw&s'" },
 
];

const Categories = () => {
  const { width, height } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <Text style={styles.viewAll}>Ver todas</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={[styles.categoryItem,{height: height * 0.055, }]}>
            <Image source={{ uri: category.imageUrl }} style={styles.image} />
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  viewAll: {
    color: '#A29AC2',
  },
  scrollContainer: {
    flexDirection: 'row',
    
  },
  categoryItem: {
    marginRight: 16,
    alignItems: 'center',
    display: 'flex',
    paddingRight: 20,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor:"#b65eff30"
    
  },
  image: {
    width: 40,  
    marginRight:15,          
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
  },
  
  categoryName: {
    color: '#e2e2e2',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
  
  },
});

export default Categories;
