import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Sliders, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/constants/theme/useTheme';
const keywords = ["fiestas", "charlas", "conciertos", "eventos", "reuniones"];

const SearchBar = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const [keywordIndex, setKeywordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKeywordIndex((prevIndex) => (prevIndex + 1) % keywords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    router.push("(tabs)/search");
  };

  return (
    <TouchableOpacity style={[styles.container,{backgroundColor:theme.colors.placeholder }]} onPress={handlePress}>
      <Search color="#A29AC2" size={20} style={styles.searchIcon} />
      <View style={styles.inputContainer}>
        <Text style={styles.placeholderText}>
          Buscar{" "}
          <Text style={styles.boldText}>{keywords[keywordIndex]}</Text>
        </Text>
      </View>
      <View style={styles.divider} />
      <Sliders color="#A29AC2" size={20} style={styles.sliderIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
   
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#A29AC2',
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#8f64b8',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#A29AC2',
    marginHorizontal: 12,
  },
  sliderIcon: {
    marginLeft: 8,
  },
});

export default SearchBar;
