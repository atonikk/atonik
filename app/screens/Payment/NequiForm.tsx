import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import SvgNequi from "../../../assets/svgs/SvgNequi.svg";
import { useLayoutEffect } from "react";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import url from "../../../constants/url.json";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const NequiForm: React.FC = () => {
  const [messageid, setMessageid] = React.useState("");
  const [clientid, setclientid] = React.useState("");
  const [transactionid, setTransactionid] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [name, setName] = React.useState("");
  const { id } = useLocalSearchParams();
  const [token, setToken] = React.useState<string | null>(null);
  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push({ pathname: "/screens/Account/Login" });
    }
  };
  const makePayment = async () => {
    try {

      const response = await axios.post(
        `${url.url}/api/make_payment`,
        {
          event_id: id,
          full_name: name,
          phone_number: number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessageid(response.data.messageid);
      setclientid(response.data.clientid);
      setTransactionid(response.data.transactionid);
 
      if (response.status === 200) {
        router.push({
          pathname: "/screens/Payment/CheckNequi",
          params: {
            messageid: response.data.messageid,
            clientid: response.data.clientid,
            transactionid: response.data.transactionid,
          },
        });
      }
    } catch (error) {
      console.error(error);
      console.log("Error en el pago", error);
    }
  };
  const navigation = useNavigation();
  const handleSubmit = () => {
    router.push({
      pathname: "/screens/Payment/CheckNequi",
    });
  };
  useLayoutEffect(() => {
    checkToken();
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajusta el comportamiento según el sistema operativo
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Ajusta según el diseño de tu pantalla
    >
      <View style={styles.container}>
        <View style={styles.divlogo}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/logo.png")}
          />
          <Text
            style={{
              top: "40%",
              color: "#fff",
              fontSize: 18,
              textAlign: "center",
            }}
          >
            Estas a punto de pagar tu entrada
          </Text>
        </View>

        <View style={styles.svgcontainer}>
          <SvgNequi style={{ position: "absolute", top: "5%" }} />
          <Image
            source={require("../../../assets/images/NequiPng.png")}
            style={{ position: "absolute", top: "5%", resizeMode: "contain" }}
          />
          <View style={styles.cajaInputs}>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/userblack.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputUser]}
                placeholder="Nombre completo"
                placeholderTextColor="#7C7C7C"
                onChangeText={(text) => setName(text)}
                value={name}
              />
            </View>
            <View style={styles.inputCaja}>
              <Image
                source={require("../../../assets/images/phoneblack.png")}
                style={styles.iconUser}
              />
              <TextInput
                style={[styles.input, styles.inputUser]}
                placeholder=" Numero de telefono (sin +57) "
                placeholderTextColor="#7C7C7C"
                keyboardType="numeric"
                onChangeText={(text) => setNumber(text)}
              />
            </View>
            <Pressable onPress={makePayment} style={styles.botoncontinuar}>
              <Text style={styles.whitetext}>Continuar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    justifyContent: "center",
    alignItems: "center",
  },
  divlogo: {
    position: "absolute",
    width: "100%",
    height: "10%",
    top: "5%",
  },
  logo: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  svgcontainer: {
    position: "absolute",
    top: "25%",
    width: "100%",
    height: windowHeight * 0.45,
    alignItems: "center",
    padding: "5%",
    flexDirection: "column",
  },
  inputCaja: {
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    flexDirection: "row",
    marginBottom: "20%",
  },
  input: {
    color: "black",
    fontSize: 17,
    width: "100%",
  },
  inputUser: {},
  cajaInputs: {
    alignItems: "center",
    marginTop: "10%",
    position: "absolute",
    width: "80%",
    height: "70%",
    justifyContent: "center",
    top: "16%",
  },
  botoncontinuar: {
    position: "absolute",
    bottom: "0%",
    width: "65%",
    height: "25%",
    backgroundColor: "#DB0083",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  whitetext: {
    color: "#fff",
    fontSize: 20,
  },
  iconUser: {
    marginRight: "2%",
    width: 30,
    height: 30,
  },
});

export default NequiForm;
