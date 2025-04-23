import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Layout() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("access_token");
      setIsVisible(!!token); // true si hay token, false si no
    };

    checkToken();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="Perfil"
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#311049",
            width: "60%",
          },
          drawerLabelStyle: {
            color: "#FFFFFF",
            fontWeight: "bold",
          },
          drawerItemStyle: {
            backgroundColor: "#530e85",
            borderRadius: 20,
            marginVertical: 5,
          },
        }}
      >
        <Drawer.Screen
          name="Perfil"
          options={{
            drawerLabel: "Perfil",
            title: "Perfil",
          }}
        />
        {isVisible && (
          <Drawer.Screen
            name="Delete"
            options={{
              drawerLabel: "Eliminar Cuenta",
              title: "Eliminar Cuenta",
            }}
          />
        )}
      </Drawer>
    </GestureHandlerRootView>
  );
}
