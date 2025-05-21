import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import LocationSelector from '@/components/home/LocationSelector';
import SearchBar from '@/components/home/SearchBar';
import Categories from '@/components/home/Categories';
import DateSelector from "@/components/dateSelector"
import { useAppTheme } from "@/constants/theme/useTheme";
const AtonikScreen = () => {
  const theme = useAppTheme();
  return (
    <ScrollView style={[styles.container,{ backgroundColor: theme.colors.background }]}>
      <Image source={require('@/assets/images/Atonik.png')} style={[
        styles.titleImage,
        { tintColor: theme.colors.state ? "#ffff " : theme.colors.primary  }
      ]} />

      <LocationSelector />
      <SearchBar />
      <Categories />
<DateSelector/>
      <View style={styles.recommendedContainer}>
        <Text style={styles.recommendedTitle}>Recomendados</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
 
    flex: 1,
    paddingHorizontal: 16,
  },
  titleImage: {
    width: 100,
  
    resizeMode: 'contain',
    marginBottom: 0,
  },
  recommendedContainer: {
    marginTop: 24,
  },
  recommendedTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default AtonikScreen;
