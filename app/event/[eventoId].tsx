import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const Event = () => {
  const router = useRouter();
  const { eventoId } = useLocalSearchParams(); // Obtener eventoId desde la URL
  useEffect(() => {
    console.log("Evento ID:", eventoId);
  }, [eventoId]); // Log para verificar el eventoId
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evento ID: {eventoId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", 

    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Event;
