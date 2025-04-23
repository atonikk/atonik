import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function Layout() {
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRedirect(true);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  if (showRedirect) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/json/splash.json')} // Ruta de tu archivo .json
        autoPlay
        loop={false}  
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7151ff', // Puedes personalizar
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 500,
    height: 500,
  },
});
