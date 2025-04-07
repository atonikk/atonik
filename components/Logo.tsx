import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Logo = ({ existsDerechos }: { existsDerechos: boolean }) => {
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
    "LexenTera-Medium": require("@/assets/fonts/LexendTera-Medium.ttf"),
    "Koho-BoldItalic": require("@/assets/fonts/KoHo-BoldItalic.ttf"),
  });

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null; // No renderizar hasta que las fuentes estén cargadas
  }

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        top: keyboardVisible ? "2%" : "4%",
        width: "80%",
        height: keyboardVisible ? height * 0.2 : height * 0.3,
        alignItems: "center",
        alignContent: "space-around",
      }}
    >
      {existsDerechos && (
        <Text
          style={{
            color: "white",
            fontFamily: "LexenTera-Medium",
            fontSize: 24,
            textAlign: "center",
            position: "absolute",
            top: "0%",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          DERECHOS{"\n"}RESERVADOS
        </Text>
      )}
      <Image
        style={[
          styles.logo,
          {
            width: keyboardVisible ? "60%" : "80%",
            height: keyboardVisible ? "60%" : "80%",

          },
        ]}
        source={logo}
      />
      <Text
        style={{
          color: "#FFFFFF",
          fontFamily: "Koho-BoldItalic",
          fontSize: keyboardVisible ? 48 : 64,
          textAlign: "center",
        }}
      >
        AtoniK
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    resizeMode: "contain",
  },
});

export default Logo;
