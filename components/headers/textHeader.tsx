import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "@/constants/theme/useTheme";
import { useWindowDimensions } from 'react-native';

const CustomHeaderTitle = ({ title }) => {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const { height, width } = useWindowDimensions();

  return (
    <View style={{ 
      height: height * 0.07, 
      backgroundColor: theme.colors.background, 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 10 
    }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Text style={{ marginLeft:"2%",fontSize: 17, fontWeight: '300', color: theme.colors.text }}>
        {title}
      </Text>
    </View>
  );
};

export default CustomHeaderTitle;
