import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import SvgContainer from "@/components/SvgContainer";
import Logo from "@/components/Logo";
import BotonRegister from "@/components/botonRegister";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import url from "@/constants/url.json";
import { router } from "expo-router";
import ModalRounded from "@/components/ModalRounded";
import { Dimensions } from "react-native";
import { enableScreens } from "react-native-screens";

const { width, height } = Dimensions.get("window");
const User = () => {
  enableScreens(false);

  const [username, setUsername] = useState<string>("");
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [modalRoundedText, setModalRoundedText] = useState<string>("");
  const [modalTextButton, setModalTextButton] = useState<string>("");

  const checkUsername = async (username: string) => {
    if (!username) {
      setModalRoundedText("Por favor, ingresa un nombre de usuario.");
      setModalTextButton("Aceptar");
      setModalRoundedVisible(true);
      return;
    }
    try {
      const response = await axios.get(`${url.url}/check_user/${username}`);
      if (response.status === 200) {
        router.push({
          pathname: "/screens/Account/Number",
          params: { username: username },
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setModalRoundedText(
          "El nombre de usuario ya está en uso, por favor elige otro."
        );
        setModalTextButton("Aceptar");
        setModalRoundedVisible(true);
      } else {
        console.error("Error checking username:", error);
      }
    }
  };
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#131313", // Asegura que el fondo sea oscuro siempre
      }}
    >
      <StatusBar style="light" backgroundColor="#000000" />
      {/* <ImageBackground
        source={require("../../../assets/images/backgroundLogin.png")}
        style={styles.background}
      > */}
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <View
            style={{
              width: "90%",
              height: "90%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "0%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-ExtraLightItalic",
                fontSize: 28,
                marginTop: "9%",
                textAlign: "center",
                width: "100%",
              }}
            >
              {" "}
              Escribe tu nombre de usuario
            </Text>
            <TextInput
              style={{
                width: "100%",
                height: "20%",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
                fontFamily: "Inter-ExtraLightItalic",
                borderRadius: 20,
                textAlign: "center",
                fontSize: 24,
                color: "white",
                marginBottom: "15%",
              }}
              value={username}
              onChangeText={(text) => setUsername(text)}
              maxLength={20}
              autoCorrect={false}
              autoComplete="off"
              autoFocus={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                checkUsername(username);
              }}
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={true}
              textContentType="username"
              keyboardType="default"
              placeholder="Ej: usuariodeatonik"
              placeholderTextColor="#FFFFFF"
              autoCapitalize="none"
            />
            <BotonRegister
              textboton="Continuar"
              onPress={() => checkUsername(username)}
            />
          </View>
        </SvgContainer>
      </View>
      <ModalRounded
        text={modalRoundedText}
        textbutton={modalTextButton}
        isVisible={isModalRoundedVisible}
        onClose={() => {
          setModalRoundedVisible(false);
        }}
      />
      {/* </ImageBackground> */}
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});
