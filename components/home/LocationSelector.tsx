import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from "@/constants/theme/useTheme";
const LocationSelector = () => {
  const router = useRouter();
  const [cityName, setCityName] = useState('');
  const theme = useAppTheme();
  const fetchCity = async () => {
    try {
      const storedCity = await AsyncStorage.getItem('@selectedCity');
      if (storedCity) {
        const city = JSON.parse(storedCity);
        setCityName(`${city.name}, ${city.country}`);
      } else {
        setCityName('Seleccionar ubicación');
      }
    } catch (error) {
      console.error('Error al obtener la ciudad:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCity();
    }, [])
  );

  const onPress = () => {
    router.push({
      pathname: "screens/Events/UbicationSelector",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <MapPin color="#5a31ff" size={20} />
      </View>
      
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={[styles.textAbove,{color:theme.colors.text}]}>Ubicación</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.text,{color:theme.colors.text}]}>{cityName}</Text>
          <ChevronDown color="#ffffff" size={15} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0,
    borderColor: '#8E3DA3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  button: {
    marginLeft: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAbove: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '100',
  },
});

export default LocationSelector;
