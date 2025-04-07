import React, { useState } from "react";
import {
  Image,
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import url from "../../constants/url.json";
import { LinearGradient } from "expo-linear-gradient"; // Asegúrate de instalar expo-linear-gradient
import { useNavigation, router } from "expo-router";
import EventItem from "@/components/eventItemListSearch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { criticallyDampedSpringCalculations } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";
import Panel from "@/components/panelPushUp";
import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");
export default function Tab() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Usuarios");
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  const closePanel = () => {
    setIsVisible(false);
  };

  interface User {
    _id: string;
    profile_photo: string;
    usuario: string;
    followingnum: number;
    followersnum: number;
    description: string;
  }

  interface Event {
    _id: string;
    image: string;
    name: string;
    place: string;
    colors: string[];
    price: number;
    date: string;
    time: string;
    description: string;
    latitude: string;
    longitude: string;
    images: string[];
  }

  const searchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      console.log("Haciendo la busqueda");
      if (token === null) {
        togglePanel();
      } else {
        setLoading(true);
        const response = await axios.get(
          `${url.url}/api/search/username?keyword=${keyword}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setUsers(response.data);
      }
    } catch (error) {
      setError("No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };
  const Separator = () => (
    <View style={{ height: 1, backgroundColor: "#cccccc" }} />
  );
  const searchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("access_token");

      const response = await axios.get(
        `${url.url}/api/search/event?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.length === 0) {
        setError("No se encontraron eventos con el criterio de búsqueda.");
      }
      setEvents(response.data);
    } catch (error) {
      setError("No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <Pressable
      style={styles.userItem}
      onPress={() =>
        router.push({
          pathname: "/screens/Account/UserProfile",
          params: {
            userId: item._id,
            getprofile_photo: item.profile_photo,
            getusuario: item.usuario,
            getfollowingnum: item.followingnum,
            getfollowersnum: item.followersnum,
            getdescription: item.description,
          },
        })
      }
    >
      {item.profile_photo === "" ? (
        <Image
          source={require("../../assets/images/userShadow.png")}
          style={styles.userImage}
        />
      ) : (
        <Image source={{ uri: item.profile_photo }} style={styles.userImage} />
      )}
      <Text style={styles.userName}>{item.usuario}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <View style={styles.bar}>
          <Image
            tintColor={"#ffffffab"}
            style={styles.searchIcon}
            source={require("../../assets/images/searchIcon.png")}
          />
          <TextInput
            style={styles.input}
            placeholder="Busca usuarios o eventos"
            placeholderTextColor="#888"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={
              activeTab === "Usuarios" ? searchUsers : searchEvents
            }
            returnKeyType="search"
          />
        </View>
        <View style={styles.cajabuttons}>
          <Pressable
            onPress={() => setActiveTab("Usuarios")}
            style={[
              styles.tabButton,
              activeTab === "Usuarios" && styles.activeTabButton,
            ]}
          >
            <Text style={styles.buttontext}>Usuarios</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("Eventos")}
            style={[
              styles.tabButton,
              activeTab === "Eventos" && styles.activeTabButton,
            ]}
          >
            <Text style={styles.buttontext}>Eventos</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.listContent}>
        {loading ? (
          <View
            style={{
              position: "absolute",
              top: "50%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#733086" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : activeTab === "Usuarios" ? (
          users.length > 0 ? (
            <View style={styles.resultadosDiv}>
              <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item._id}
                style={styles.listausers}
              />
            </View>
          ) : (
            <View style={styles.noResultsDiv}>
              <Text style={styles.noResultsText}>Busca a tus amigos! </Text>
            </View>
          )
        ) : activeTab === "Eventos" ? (
          events.length > 0 ? (
            <View style={styles.resultadosDiv}>
              <EventItem events={events} state={true} navigation={navigation} />
            </View>
          ) : (
            <View style={styles.noResultsDiv}>
              <Text style={styles.noResultsText}>
                Busca algun evento de tu interes!
              </Text>
            </View>
          )
        ) : null}
      </View>
      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "2%",
    flex: 1, // Usar flex: 1 para ocupar toda la pantalla
    backgroundColor: "#131313",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  listausers: {
    width: "100%",
    height: "100%",
  },
  nav: {
    position: "relative",
    paddingTop: "10%",
    alignItems: "center",
    width: "100%",
    height: "25%",
  },
  bar: {
    alignItems: "center",
    borderColor: "#a681ff",
    borderWidth: 2,
    width: "90%",
    height: height * 0.06,
    borderRadius: 16,
    flexDirection: "row",
  },
  input: {
    height: "100%",
    width: "100%",
    paddingLeft: 10,
    color: "#ffffffd3",
  },
  searchIcon: {
    marginLeft: 10,
    height: 27,
    width: 27,
  },

  cajabuttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: "5%",
  },
  tabButton: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#a681ff",
  },
  buttontext: {
    color: "#ffffffd3",
    textAlign: "center",
  },
  listContent: {
    marginTop: "5%",
    position: "absolute",
    top: "8%",
    width: "100%",
    height: "90%",
  },
  userItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: "#ffffffd3",
  },
  resultadosDiv: {
    marginTop: "20%",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingBottom: height * 0.1,
  },

  errorText: {
    width: "100%",
    position: "absolute",
    top: "50%",
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  noResultsDiv: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    position: "absolute",
    top: "30%",
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  eventItem: {
    width: "100%",
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
