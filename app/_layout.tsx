import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <RootLayoutNav />
    </View>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: "#301446",
        },
        contentStyle: {
          backgroundColor: "#000", // 📌 Fondo oscuro para todas las pantallas
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/User"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/UserGoogle"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Number"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Nombre"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Edad"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/Account/Password"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // 📌 Fondo oscuro para toda la aplicación
  },
});
