import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";


export const unstable_settings = {
  initialRouteName: "(tabs)",
};

 SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            /*           headerStyle: {
            backgroundColor: "#050259",
          },
          headerTintColor: "#050259", */
          }}
        />
        
    </Stack>
  );
}
