import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { useFonts } from "expo-font";
const BotonRegister = ({
  textboton,
  onPress,
}: {
  textboton: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.quieroserbutton} onPress={onPress}>
      <Text
        style={{
          color: "white",
          fontFamily: "Inter-ExtraLightItalic",
          fontSize: 28,
          textAlign: "center",
          width: "100%",
        }}
      >
        {textboton}
      </Text>
    </TouchableOpacity>
  );
};

export default BotonRegister;
const styles = StyleSheet.create({
  quieroserbutton: {
    width: width * 0.5,
    height: height * 0.065,
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
});
