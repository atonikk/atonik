import React, { useState, useLayoutEffect } from "react";
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
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import url from "../../../constants/url.json";
import CustomModal from "@/components/modalAlert";
const ChangePassword: React.FC = () => {
  const { phoneNumber } = useLocalSearchParams();
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
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

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      showModalAlert("Las contrasenas no coinciden");
    } else {
        try {
          const response = await fetch(`${url.url}/api/forgot_password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone : phoneNumber,
              password: password,
            }),
          });
          if (response.status === 200) {
            showModalAlert("Se cambio la contraseña correctamente");
            router.push("/screens/Account/Login");
          }
        } catch (error) {
            console.error(error);
            showModalAlert("Ha habido un error y no se ha cambiado la contraseña");
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
        <View style={styles.divDerechos}>
          <Text style={styles.derechos}>DERECHOS RESERVADOS</Text>
        </View>
        <View style={styles.divImg}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/LogoLetras.png")}
          />
        </View>

        <View style={styles.container}>
          <Svg
            width={339}
            height={324}
            fill="none"
          >
            <Path
              fill="#2D0A42"
              d="M0 20C0 8.954 8.954 0 20 0h299c11.046 0 20 8.954 20 20v240.746a20 20 0 0 1-14.648 19.271l-152.887 42.465a20.003 20.003 0 0 1-10.913-.059L14.439 280.128A20 20 0 0 1 0 260.917V20Z"
            />
          </Svg>
          <View style={styles.cajaRegistro}>
            <Text style={styles.registro}>Cambio de contraseña</Text>
          </View>
          <View style={styles.cajaInputs}>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/pass.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputPass]}
                placeholder=" Contraseña"
                placeholderTextColor="rgba(124, 124, 124, 1)"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.showPassword}
                onPress={togglePasswordVisibility}
              >
                <Image
                  source={
                    currentIcon === "closed"
                      ? require("../../../assets/images/closed.png")
                      : require("../../../assets/images/eye.png")
                  }
                  style={styles.iconPass}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/pass.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputPass]}
                placeholder=" Repite la contrasena"
                placeholderTextColor="rgba(124, 124, 124, 1)"
                secureTextEntry={!isPasswordConfirmVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.showPassword}
                onPress={togglePasswordConfirmVisibility}
              >
                <Image
                  source={
                    currentConfirmIcon === "closed"
                      ? require("../../../assets/images/closed.png")
                      : require("../../../assets/images/eye.png")
                  }
                  style={styles.iconPass}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonCaja}>
            <Pressable
              style={styles.button}
              onPress={handleUpdatePassword}
            >
              <Text style={styles.buttonText}>Actualizar Contraseña</Text>
            </Pressable>
          </View>
        </View>
        <CustomModal 
        onBackdropPress={toggleAlert}
        isVisible={isAlertVisible}
        toggleModal={toggleAlert}
        modalText={AlertText}
      />
        <View style={styles.divSince}>
          <Text style={styles.since}>Since 2024</Text>
        </View>
      </View>
    </ImageBackground>
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
    bottom: "10%",
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
    width: "100%",
    height: "100%",
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
    marginTop: "3%",
    top: "20%",
    alignItems: "center",
  },
  registro: {
    fontStyle: "italic",
    position: "absolute",
    color: "white",
    fontSize: 24,
    fontWeight: "light",
  },
  cajaInputs: {
    marginTop: "8%",
    position: "absolute",
    width: "90%",
    height: "50%",
    top: "18%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  inputCaja: {
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    marginBottom: "15%",
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
    top: "60%",
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

export default ChangePassword;
