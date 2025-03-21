// Home.tsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../assets/images/logo.png";

import url from "../../constants/url.json";
import EventItem from "../../components/eventItemList";
import EventListTop from "../../components/eventListTop";
import DateSelector from "./../../components/dateSelector";

export default function Home() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <View style={styles.listContainer}>
        <Text style={styles.p1}>Recomendados</Text>
        <EventListTop />
      </View>
      <DateSelector />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  logo: {
    height: 50,
    width: 50,
    marginTop: "12%",
  },

  container: {
    backgroundColor: "#181818",
    flex: 1,

    alignItems: "center",
  },
  listContainer: {
    marginTop: 15,
    height: "27%", // Ajusta la altura según tus necesidades
  },
  p1: {
    color: "white",
    fontSize: 20,
    fontWeight: "100",
    marginLeft: 10,
    marginBottom: 10,
  },
});
