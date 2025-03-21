import React, { useState, useCallback, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from "react-native";
import {
  useNavigation,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import buttonWompi from "../../screens/Payment/ButtonWompi";
const Select = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../../../assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("../../../assets/fonts/InterDisplay-Bold.ttf"),
    "Inter-Light": require("../../../assets/fonts/Inter-Light.ttf"),
    "Inter-Thin": require("../../../assets/fonts/Inter-Thin.ttf"),
    "Inter-ExtraLight": require("../../../assets/fonts/InterDisplay-ExtraLight.ttf"),
    "Roboto-Light": require("../../../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Black": require("../../../assets/fonts/Roboto-Black.ttf"),
  });


  
  const handleNequi = () => {
    router.push({
      pathname: "/screens/Payment/NequiForm",
      params: {
        id: String(id),
      },
    });
  };
  const PaymentButton = () => {
    router.push({
      pathname: "/screens/Payment/ButtonWompi",
      params: {
        id: String(id),
      },
    });
  };
  const navigation = useNavigation();
  const scaleValue = new Animated.Value(1);
  const scaleValue2 = new Animated.Value(1);
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95, // reducir el tamaño al presionar
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // volver al tamaño original al soltar
      useNativeDriver: true,
    }).start();
  };
  const handlePressIn2 = () => {
    Animated.spring(scaleValue2, {
      toValue: 0.95, // reducir el tamaño al presionar
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut2 = () => {
    Animated.spring(scaleValue2, {
      toValue: 1, // volver al tamaño original al soltar
      useNativeDriver: true,
    }).start();
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.bigcontainer}>
      <View style={styles.divlogo}>
        <Image
          style={styles.logo}
          source={require("../../../assets/images/logo.png")}
        />
      </View>
      <View style={styles.divtext}>
        <Text style={styles.whitextbig}>Metodos de pago</Text>
        <Text style={styles.whitext}>Elige tu metodo de pago favorito</Text>
      </View>
      <View style={styles.divopciones}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleNequi}
          style={styles.divopcion}
        >
          <Animated.View
            style={[styles.divanimated, { transform: [{ scale: scaleValue }] }]}
          >
            <View style={styles.divimgs}>
              <Image source={require("../../../assets/images/nequi.png")} />
            </View>
            <View style={styles.divtextoopcion}>
              <Text style={styles.wompitexto}>Nequi</Text>
            </View>
          </Animated.View>
        </Pressable>

{/*         <Pressable
          onPressIn={handlePressIn2}
          onPressOut={handlePressOut2}
          onPress={PaymentButton}
          style={styles.divopcion2}
        >
          <Animated.View
            style={[
              styles.divanimated,
              { transform: [{ scale: scaleValue2 }] },
            ]}
          >
            <View style={styles.divimgs}>
              <Image source={require("../../../assets/images/wompi.png")} />
            </View>
            <View style={styles.divtextoopcion}>
              <Text style={styles.wompitexto}>Otros medios de pago</Text>
            </View>
            <View
              id="wompi-button-container"
              style={styles.wompiButtonContainer}
            ></View>
          </Animated.View>
        </Pressable> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bigcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#131313",
  },
  divlogo: {
    position: "absolute",
    width: "20%",
    height: "10%",
    top: "5%",
  },

  webview: { height: 200, width: "100%" },

  logo: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  divtext: {
    position: "absolute",
    top: "20%",
    width: "100%",
  },
  whitextbig: {
    fontFamily: "Inter-Regular",
    fontWeight: "bold",
    fontSize: 40,
    color: "white",
    marginBottom: "2%",
  },
  whitext: {
    fontFamily: "Inter-Light",
    fontSize: 18,
    color: "#FFFFFF",
  },
  divopciones: {
    flexDirection: "column",
    position: "absolute",
    top: "35%",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "70%",
  },
  divnequi: {
    flexDirection: "column",
    backgroundColor: "#3C3C3C",
    justifyContent: "center",
    alignItems: "center",
    top: "0%",
    width: "75%",
    height: "40%",
    position: "absolute",
    borderRadius: 20,
  },
  divopcion: {
    position: "absolute",
    top: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    width: "75%",
    height: "35%",
    backgroundColor: "#232323",
  },
  divanimated: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  divopcion2: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    width: "75%",
    height: "35%",
    backgroundColor: "#232323",
    marginTop: "40%",
  },

  wompitexto: {
    padding: "5%",
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: "white",
  },
  divimgs: {
    position: "absolute",
    top: "0%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "70%",
  },
  divtextoopcion: {
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "25%",
    borderTopWidth: 0.25,
    position: "absolute",
    bottom: "5%",
  },
  wompiButtonContainer: { marginTop: 10 },
});

export default Select;
