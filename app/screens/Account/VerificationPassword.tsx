import React, { useState, useLayoutEffect } from "react";
import {
  View,
  TextInput,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import { useNavigation, router } from 'expo-router';
import url from "../../../constants/url.json";
import CustomModal from "@/components/modalAlert";
const VerificationPassword: React.FC = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const sendVerificationCode = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Error", "Por favor ingrese un número de teléfono válido.");
      return;
    }

    try {
      const response = await axios.post(`${url.url}/api/send_verification_code`, {
        phone: phoneNumber,
      });

      if (response.status === 200) {
        setIsCodeSent(true);
        startTimer();

      }

    } catch (error) {
      console.error(error);
      showModalAlert("Hubo un problema al enviar el código de verificación.");
    }
  };

  const startTimer = () => {
    setTimer(5);
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleContinue = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Por favor ingrese un código de verificación válido.");
      return;
    }

    try {
      const response = await axios.post(`${url.url}/api/verify_code`, {
        phone: phoneNumber,
        code: verificationCode,
      });

      if (response.status === 200) {
        Alert.alert("El código de verificación correcto.");
        router.push({
          pathname: "/screens/Account/ChangePassword",
          params: {phoneNumber},
        })
      } 
    } catch (error) {
      console.error("Error verifying code:", error);
      Alert.alert("Error", "Hubo un problema al verificar el código de verificación.");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/backgroundLogin.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.divderechos}>
          <Text style={styles.derechos}>DERECHOS RESERVADOS</Text>
        </View>
        <View style={styles.divimg}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/LogoLetras.png")}
          />
        </View>

        <View style={styles.container}>
          <Svg width={320} height={344} fill="none">
            <Path
              fill="#2D0A42"
              d="M0 20C0 8.954 8.954 0 20 0h280c11.046 0 20 8.954 20 20v249.632a20 20 0 0 1-14.195 19.139l-143.181 43.431a20.004 20.004 0 0 1-11.834-.069L13.972 288.882A20 20 0 0 1 0 269.812V20Z"
            />
          </Svg>
          <View style={styles.cajabienvenida}>
            {!isCodeSent ? (
              <Text style={styles.bienvenida}>Numero de teléfono</Text>
            ) : (
              <Text style={styles.bienvenida}>Código de verificación</Text>
            )}
          </View>

          <View style={styles.cajainputs}>
            {!isCodeSent ? (
              <TextInput
                style={styles.input}
                placeholder="Teléfono sin prefijo"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Código"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
            )}
          </View>

          <View style={styles.cajabotones}>
            <TouchableOpacity
              style={styles.button}
              onPress={isCodeSent ? handleContinue : sendVerificationCode}
              disabled={isCodeSent && timer > 0}
            >
              <Text style={styles.buttonText}>
                {isCodeSent ? "Verificar" : "Enviar Código"}
              </Text>
            </TouchableOpacity>
            {isCodeSent && (
              <View style={styles.cajareenviar}>
                <Text style={styles.reenviar}>
                  Reenviar en {timer}s
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.divsince}>
        <Text style={styles.since}>Since 2024</Text>
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
  since: {
    position: "absolute",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontStyle: "italic",
    color: "white",
    fontSize: 20,
  },
  divsince: {
    justifyContent: "center",
    alignItems: "center",
    bottom: "5%",
    width: "100%",
    height: "4%",
    position: "relative",
  },
  divimg: {
    bottom: "20%",
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
    bottom: "18%",
    width: 320,
    height: 344,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  button: {
    top: "45%",
    width: "85%",
    height: "35%",
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "500",
  },
  cajabienvenida: {
    width: "100%",
    height: "10%",
    position: "absolute",
    top: "10%",
    alignItems: "center",
  },
  bienvenida: {
    position: "absolute",
    color: "white",
    fontSize: 24,
  },
  cajainputs: {
    color: "white",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    height: "15%",
    top: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  cajabotones: {
    width: "70%",
    height: "35%",
    position: "absolute",
    top: "42%",
    alignItems: "center",
  },
  cajareenviar: {
    height: "20%",
    width: "100%",
    left: "0%",
    color: "white",
    fontSize: 12,
  },
  reenviar: {
    top: "0%",
    fontStyle: "italic",
    left: "0%",
    color: "#654869",
    fontSize: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: '70%',
    height: 50,
    fontSize: 20,
    textAlign: "center",
    borderRadius: 10,
    color: "white",
  },
});

export default VerificationPassword;
