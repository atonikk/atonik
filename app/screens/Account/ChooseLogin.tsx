import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation, router } from "expo-router";
import CustomModal from "@/components/modalAlert";
import { StatusBar } from "expo-status-bar";
import SignUpGoogle from "@/components/SignUpGoogle";
import SvgContainer from "@/components/SvgContainer";
import Logo from "@/components/Logo";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useFonts } from "expo-font";
import axios from "axios";
import url from "@/constants/url.json";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const ChooseLogin: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "Inter-ExtraLightItalic": require("@/assets/fonts/Inter-4.0/extras/ttf/InterDisplay-ExtraLightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
  });
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const navigation = useNavigation();
  const [Number, setNumber] = useState<string>("");
  const [Nombre, setNombre] = useState<string>("");
  const [User, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "667525490941-h60k47ugmhglbjmb9hkp17b7uiara5jg.apps.googleusercontent.com", // Replace with the correct web client ID from Google API Console
      offlineAccess: true, // Para obtener el refresh token
    });
  }, []);
  useEffect(() => {
    console.log("Comprobando si ya hay sesión iniciada...");
    const checkIfSignedIn = async () => {
      const isSignedIn = (await GoogleSignin.getCurrentUser()) !== null;
      if (isSignedIn) {
        const userInfo = await GoogleSignin.getCurrentUser();
        console.log("Ya hay sesión iniciada:", userInfo?.user.photo);
        await AsyncStorage.setItem("userPhoto", userInfo?.user.photo || "");
        router.push({
          pathname: "/(tabs)/profile",
        });
      } else {
        console.log("No hay sesión iniciada.");
      }
    };

    checkIfSignedIn();
  }, []);

  const existUser = async (
    email: string,
    familyName: string,
    givenName: string,
    name: string,
    photo: string,
    id: string
  ) => {};

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        console.log("idToken: ", idToken);
        console.log("user: ", user);
        const { email, familyName, givenName, id, name, photo } = user;
        console.log(id);
        const responseapi = await axios.post(`${url.url}/validate_token`, {
          token: id,
        });
        if (responseapi.status === 200) {
          console.log("Usuario ya existe");
          await AsyncStorage.setItem(
            "access_token",
            responseapi.data.access_token
          );
        } else if (responseapi.status === 404) {
          console.log("Usuario no existe");
          router.push({
            pathname: "/screens/Account/UserGoogle",
            params: {
              email,
              familyName,
              givenName,
              id,
              name,
              photo,
            },
          });
        } else {
          throw new Error("Error checking user existence");
        }
      } else {
        console.log("El usuario cancelo el inicio de sesion");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            setMessage("El inicio de sesión ya está en progreso");
            console.log("El inicio de sesión ya está en progreso");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setMessage("Los servicios de Google Play no están disponibles");
            console.log("Los servicios de Google Play no están disponibles");
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            setMessage("El usuario canceló el inicio de sesión");
            console.log("El usuario canceló el inicio de sesión");
            break;
          case statusCodes.SIGN_IN_REQUIRED:
            setMessage("Se requiere inicio de sesión");
            console.log("Se requiere inicio de sesión");
            break;
          default:
            console.log("Error desconocido: ", error.message);
        }
      } else {
        console.log("Error: ", error.message);
      }
    }
  };

  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState<boolean>(false);
  const [currentIcon, setCurrentIcon] = useState<string>("closed");
  const [currentConfirmIcon, setCurrentConfirmIcon] =
    useState<string>("closed");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setCurrentIcon(currentIcon === "closed" ? "pass" : "closed");
  };

  const togglePasswordConfirmVisibility = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
    setCurrentConfirmIcon(currentConfirmIcon === "closed" ? "pass" : "closed");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <ImageBackground
        source={require("../../../assets/images/backgroundLogin.png")}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Logo existsDerechos={false} />
          <SvgContainer>
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-ExtraLightItalic",
                fontSize: 28,
                marginTop: "9%",
                position: "absolute",
                top: 0,
                textAlign: "center",
                width: "100%",
              }}
            >
              {" "}
              Elige un metodo{"\n"}de inicio de sesion
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: "12%",
                width: "80%",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "column",
                height: "50%",
                paddingVertical: 20,
              }}
            >
              <GoogleLoginButton onPress={handleGoogleSignIn} />
              <View
                style={{
                  width: "100%",
                  height: "40%",
                  marginTop: "14%",
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Image source={require("../../../assets/images/line.png")} />
                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                    fontFamily: "Inter-ExtraLightItalic",
                    position: "absolute",
                    top: 0,
                    marginHorizontal: "5%",
                    marginVertical: "2%",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  O{" "}
                </Text>
                <Image source={require("../../../assets/images/line.png")} />
              </View>

              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/screens/Account/Login",
                  });
                }}
                style={{
                  borderRadius: 45,
                  marginVertical: 10,
                  paddingHorizontal: 10,
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexDirection: "row",
                  borderWidth: 1,
                  height: height * 0.055,
                  backgroundColor: "#ffffff",
                }}
              >
                <View
                  style={{
                    width: "12%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("@/assets/images/phone.png")}
                    style={{
                      resizeMode: "contain",
                      width: "90%",
                      height: "90%",
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: "black",
                    fontSize: width * 0.04, // Proportional font size based on screen width
                    padding: 8,
                    fontFamily: "Roboto-Medium",
                  }}
                >
                  Numero de telefono
                </Text>
              </TouchableOpacity>
            </View>
          </SvgContainer>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  divDerechos: {
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
  divSince: {
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
  divImg: {
    bottom: "15%",
    marginBottom: "2%",
    width: "40%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logo: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  container: {
    bottom: "20%",
    width: 300,
    height: 500,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cajaRegistro: {
    width: "100%",
    height: "10%",
    position: "absolute",
    top: "5%",
    alignItems: "center",
  },
  registro: {
    fontStyle: "italic",
    position: "absolute",
    color: "white",
    fontSize: 30,
    fontWeight: "light",
  },
  cajaInputs: {
    marginTop: "8%",
    position: "absolute",
    width: "90%",
    top: "12%",
    alignItems: "flex-start",
  },
  inputCaja: {
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    marginBottom: "10%",
  },
  iconUser: {
    marginRight: 5,
    top: 0,
    width: 30,
    height: 30,
  },
  iconPass: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  showPassword: {
    position: "absolute",
    left: "85%",
    top: 0,
    width: 30,
    height: 30,
  },
  input: {
    color: "#fff",
    fontSize: 17,
    width: "100%",
  },
  inputUser: {},
  inputPass: {},
  buttonCaja: {
    top: "75%",
    height: "10%",
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "80%",
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
  },
  buttonText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "500",
  },
});

export default ChooseLogin;
