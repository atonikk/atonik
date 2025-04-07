import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import SvgContainer from "@/components/SvgContainer";
import { useFonts } from "expo-font";
import Logo from "@/components/Logo";
import BotonRegister from "@/components/botonRegister";
import ModalRounded from "@/components/ModalRounded";
import axios from "axios";
import url from "@/constants/url.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { jwtDecode } from "jwt-decode";
const Password = () => {
  const { username, phoneNumber, nombre, fecha } = useLocalSearchParams();
  const [isModalRoundedVisible, setModalRoundedVisible] =
    useState<boolean>(false);
  const [modalRoundedText, setModalRoundedText] = useState<string>("");
  const [modalTextButton, setModalTextButton] = useState<string>("");
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentIcon, setCurrentIcon] = useState<string>("closed");
  const [currentConfirmIcon, setCurrentConfirmIcon] =
    useState<string>("closed");
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const isPasswordSecure = (password: string) => {
    // Verifica si la contraseña tiene al menos 8 caracteres, una letra mayúscula, un número y un carácter especial
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setCurrentIcon(currentIcon === "closed" ? "pass" : "closed");
  };
  const togglePasswordConfirmVisibility = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
    setCurrentConfirmIcon(currentConfirmIcon === "closed" ? "pass" : "closed");
  };
  if (!fontsLoaded) {
    return null;
  }
  const registerUser = async () => {
    const data = {
      nombre,
      username,
      phoneNumber,
      fecha,
      password,
    };
    console.log(data);
    try {
      const response = await axios.post(`${url.url}/register`, {
        username: username,
        phoneNumber: phoneNumber || "", // Ensure phoneNumber is not null
        name: nombre,
        birthdate: fecha,
        password: password,
      });
      if (response.status === 201) {
        console.log("User registered successfully:", response.data);
        setModalRoundedText("Usuario registrado con exito");
        setModalTextButton("Gracias!!");
        setModalRoundedVisible(true);
        const accessToken = response.data.access_token;
        await AsyncStorage.setItem("access_token", accessToken);
        const decodedToken = jwtDecode<DecodedToken>(accessToken);

        await AsyncStorage.setItem("access_token", response.data.access_token);
        setModalRoundedText("Bienvenido, " + decodedToken.sub.user + "!");
        router.push("/(tabs)/profile");
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      setModalRoundedText("Error al registrar" + error.message);
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
    }
  };
  const handleSubmit = () => {
    if (!isPasswordSecure(password)) {
      setModalRoundedText(
        "La contraseña debe tener 8 caracteres, una letra mayúscula, un número y un carácter especial"
      );
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
    }

    if (password !== confirmPassword) {
      setModalRoundedText(
        "Las contraseñas no coinciden. Por favor, inténtalo de nuevo."
      );
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
    }
    if (password.length < 8) {
      setModalRoundedText("La contraseña debe tener al menos 8 caracteres.");
      setModalTextButton("Entendido");
      setModalRoundedVisible(true);
    }
    if (isPasswordSecure(password) && password === confirmPassword) {
      registerUser();
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/backgroundLogin.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <Text
            style={[
              styles.label,
              {
                marginTop: "8%",
              },
            ]}
          >
            Crea tu contraseña
          </Text>
          <View style={styles.cajainput}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry={isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.showPassword}
            >
              <Image
                style={styles.iconpass}
                source={
                  currentIcon === "closed"
                    ? require("../../../assets/images/closed.png")
                    : require("../../../assets/images/eye.png")
                }
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.label,
              {
                marginTop: "2%",
              },
            ]}
          >
            Confirma tu contraseña
          </Text>
          <View style={styles.cajainput}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry={isPasswordConfirmVisible}
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={togglePasswordConfirmVisibility}
              style={styles.showPassword}
            >
              <Image
                style={styles.iconpass}
                source={
                  currentConfirmIcon === "closed"
                    ? require("../../../assets/images/closed.png")
                    : require("../../../assets/images/eye.png")
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </SvgContainer>
        <ModalRounded
          text={modalRoundedText}
          textbutton={modalTextButton}
          isVisible={isModalRoundedVisible}
          onClose={() => {
            setModalRoundedVisible(false);
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default Password;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonText: {
    fontFamily: "Roboto-ExtraLight.ttf",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  iconpass: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  button: {
    width: "65%",
    height: "12%",
    marginTop: "4%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#722D86", // Color principal
    borderRadius: 15,
    borderColor: "#430857", // Borde más oscuro
    borderBottomWidth: 5,
    borderRightWidth: 5,
    shadowColor: "#5E0D75", // Añade sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra en Android
  },
  showPassword: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cajainput: {
    width: "100%",
    height: "20%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  label: {
    color: "white",
    textAlign: "center",
    fontFamily: "Inter-ExtraLightItalic",
    fontSize: 22,
    marginBottom: 10,
  },
  overlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  input: {
    width: "80%",
    height: 50,
    marginLeft: "6%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "white",
  },
});
