import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Pressable,
  BackHandler,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, router, useFocusEffect } from "expo-router";
import url from "../../../constants/url.json";
import { jwtDecode } from "jwt-decode";
import CustomModal from "../../../components/modalAlert";
import Logo from "@/components/Logo";
import SvgContainer from "@/components/SvgContainer";
import { useProfilePhotoStore } from "@/app/utils/useStore";
const { width, height } = Dimensions.get("window");
const buttonWidth = width * 0.5;
const buttonHeight = height * 0.05;

const Login: React.FC = () => {
  const setProfilePhoto = useProfilePhotoStore.getState().setProfilePhoto;
  const profile_photo = useProfilePhotoStore.getState().profilePhoto;
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [currentIcon, setCurrentIcon] = useState<string>("closed");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setCurrentIcon(currentIcon === "closed" ? "pass" : "closed");
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  useFocusEffect(
    React.useCallback(() => {
      const handleBackButtonPress = () => {
        router.push("/(tabs)/home");
        return true; // Evita que el navegador realice la acción de retroceso por defecto
      };

      const backHandler = () => {
        BackHandler.addEventListener(
          "hardwareBackPress",
          handleBackButtonPress
        );

        return () =>
          BackHandler.removeEventListener(
            "hardwareBackPress",
            handleBackButtonPress
          );
      };

      return backHandler();
    }, [])
  );

  const logueo = async () => {
    try {
      const response = await axios.post(`${url.url}/api/login`, {
        usuario,
        password,
      });

      if (response && response.data) {
        console.log("Respuesta del servidor:", response.data);
        console.log("Token:", response.data.access_token);
        const token = response.data.access_token;
        const decoded: any = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        setProfilePhoto(decoded.sub.profile_photo);
        console.log("Foto de perfil:", decoded.sub.profile_photo);
        await AsyncStorage.setItem("access_token", response.data.access_token);
        setTimeout(() => {
          router.push({
            pathname: "/(tabs)/home",
          });
        }, 1000);
      } else {
        Alert.alert("Error", "La respuesta no contiene datos");
      }
    } catch (err) {
      const error = err as AxiosError; // Tratamos el error como un AxiosError

      if (error.response && error.response.data) {
        const errorMsg =
          (error.response.data as any).msg || "Error al iniciar sesión";
        setAlertText(errorMsg); // Establecemos el mensaje en el modal
        setAlertVisible(true); // Mostramos el modal
      } else {
        setAlertText("Error de conexión al servidor"); // Mensaje de error genérico
        setAlertVisible(true); // Mostramos el modal
      }
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Oculta el encabezado
    });
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../../../assets/images/backgroundLogin.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Logo existsDerechos={false} />
        <SvgContainer>
          <Text style={styles.bienvenida}>Bienvenido</Text>
          <View style={styles.cajainputs}>
            <View style={styles.inputcaja}>
              <TextInput
                style={[styles.input]}
                placeholder="Usuario o Numero de telefono"
                autoCapitalize="none"
                placeholderTextColor="#7C7C7C"
                value={usuario}
                onChangeText={setUsuario}
              />
            </View>
            <View style={styles.inputcaja}>
              <TextInput
                style={[styles.input, styles.inputPass]}
                placeholder="Contraseña"
                placeholderTextColor="rgba(124, 124, 124, 1)"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.showpassword}
                onPress={togglePasswordVisibility}
              >
                <Image
                  source={
                    currentIcon === "closed"
                      ? require("../../../assets/images/closed.png")
                      : require("../../../assets/images/eye.png")
                  }
                  style={styles.iconpass}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.cajaforgot}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/screens/Account/VerificationPassword",
                  })
                }
              >
                <Text style={styles.contrasenaolvidada}>
                  Olvide mi contraseña
                </Text>
              </Pressable>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { width: buttonWidth, height: buttonHeight },
            ]}
            onPress={() => {
              logueo();
            }}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </SvgContainer>
      </View>
      <CustomModal
        onBackdropPress={toggleAlert}
        isVisible={isAlertVisible}
        toggleModal={toggleAlert}
        modalText={AlertText}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  divderechos: {
    marginBottom: "5%",
    marginTop: "40%",
    bottom: "20%",
    width: "50%",
    height: "8%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  derechos: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
  },
  divimg: {
    bottom: "20%",
    marginBottom: "2%",
    width: "40%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  bienvenida: {
    marginTop: "10%",
    color: "white",
    fontSize: 30,
    fontWeight: "light",
  },
  cajainputs: {
    width: "90%",
    marginTop: "5%",
    alignItems: "flex-start",
  },
  inputcaja: {
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    marginBottom: "10%",
  },
  input: {
    color: "white",
    fontSize: 17,
    width: "100%",
    position: "relative",
  },
  inputPass: {},
  showpassword: {
    position: "absolute",
    left: "90%",
    top: 0,
    width: 30,
    height: 30,
  },
  iconpass: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  cajaforgot: {
    bottom: "15%",
    position: "relative",
    width: "100%",
  },
  contrasenaolvidada: {
    fontSize: 14,
    color: "white",
    position: "relative",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: "5%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "500",
  },
  divsince: {
    justifyContent: "center",
    alignItems: "center",
    bottom: "10%",
    width: "100%",
    height: "4%",
    position: "relative",
  },
  since: {
    position: "absolute",
    bottom: "2%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontStyle: "italic",
    color: "white",
    fontSize: 20,
  },
});

export default Login;
