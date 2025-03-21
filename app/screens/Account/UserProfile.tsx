import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "@/app/_layout";
import { jwtDecode } from "jwt-decode";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import url from "../../../constants/url.json";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import Modal from "react-native-modal";
import Panel from "../../../components/panelPushUp";
import CustomModal from "@/components/modalAlert";
import CustomModalButton from "@/components/modalAlertButton";
import EventListTopProfile from "@/components/eventListTopProfile";
const { width, height } = Dimensions.get("window");

const proportionalFontSize = (size: number) => {
  const baseWidth = 375; // Ancho base (puedes ajustarlo según tus necesidades)
  return (size * width) / baseWidth;
};

const UserProfile: React.FC = () => {
  const [is_following, setIsFollowing] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const { userId, getprofile_photo, getusuario, getfollowingnum, getfollowersnum, getdescription } = useLocalSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isPanelVisible, setisPanelVisible] = useState(false);
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const togglePanel = () => {
    setisPanelVisible(!isPanelVisible);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("access_token");
    setToken(storedToken);
 
    try {
      if (storedToken !== null) {
        setisPanelVisible(false);
        checkFollowing(getusuario as string, storedToken);
      } else {
        setisPanelVisible(true);
      }
    } catch (error) {
      console.error("Error al verificar el token", error);
    }
  };  

  useEffect(() => {

    const followingNumConverted = Number(getfollowingnum);
    const followersNumConverted = Number(getfollowersnum);
    setFollowing(followingNumConverted);
    setFollowers(followersNumConverted);
    checkToken(); 

  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const closePanel = () => {
    setIsVisible(false);
  };
  const cleanData = async () => {
      router.push("/screens/Account/Login");
  };
  const checkFollowing = async (username: string, tokencheck: string) => {
    try {
      const response = await axios.get(`${url.url}/api/check_following?username=${username}`, {
        headers: {
          Authorization: `Bearer ${tokencheck}`,
        },
      });
      
      if (response.status === 200) {


        if (response.data.is_following == true) {
          setIsFollowing(true);
        }
        else{
          setIsFollowing(false);
        }
      } else {
        Alert.alert("Error", "No se pudo obtener la información de seguimiento");
      }
    } catch (error) {
      setisPanelVisible(true);
    } 
  };
  const followUser = async () => {
    try {
      const response = await axios.post(
        `${url.url}/api/follow`,
        {
          user_to_follow: getusuario, // El usuario que se desea seguir
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // El token va en los headers
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.status === 200) {
        showModalAlert(`Has seguido a ${getusuario} :D`);
        setIsFollowing(true);
        setFollowers(followers + 1);
      } else {
        Alert.alert("Error", "No se pudo seguir al usuario");
      }
    } catch (error) {
      showModalAlert("Ha habido un error al intentar seguir al usuario");
    }
  };
  const unfollowUser = async () => {
    try {
      const response = await axios.post(
        `${url.url}/api/unfollow`,
        {
          user_to_unfollow: getusuario, // El usuario que se desea seguir
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.status === 200) {
        showModalAlert(`Has dejado de seguir a ${getusuario} :(`);
        setIsFollowing(false);
        setFollowers(followers - 1);
      } else {
        Alert.alert("Error", "No se pudo seguir al usuario");
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.superior}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.cajauser}>
          <Text style={styles.welcomeText}>
            {getusuario ? getusuario : "---"}
          </Text>
        </View>
      </View>
      <View style={styles.middle}>
        {getprofile_photo ? (
          <View style={styles.cajafoto}>
            <Image
              source={{ uri: getprofile_photo as string }}
              style={styles.profilePhoto}
            />
          </View>
        ) : (
          <View style={styles.cajafoto}>
            <Image
              source={require("../../../assets/images/userShadow.png")}
              style={styles.profilePhoto}
            />
          </View>
        )}
        <View style={styles.cajainfo}>
          <View style={styles.cajaseguidores}>
            <View style={styles.seguidosinfo}>
              <View style={styles.seguidostextcaja}>
                <Text style={styles.seguidos}>SEGUIDOS</Text>
              </View>
              <View style={styles.seguidosvaluecaja}>
                {following ? (
                  <Text style={styles.value}>{following}</Text>
                ) : (
                  <Text style={styles.value}>0</Text>
                )}
              </View>
            </View>
            <View style={styles.seguidoresinfo}>
              <View style={styles.seguidostextcaja}>
                <Text style={styles.seguidos}>SEGUIDORES</Text>
              </View>
              <View style={styles.seguidosvaluecaja}>
                {followers ? (
                  <Text style={styles.value}>{followers}</Text>
                ) : (
                  <Text style={styles.value}>0</Text>
                )}
              </View>
            </View>
          </View>
          {getdescription ? (
            <View style={styles.cajadescripcion}>
              <Text style={styles.descripcion}>{getdescription}</Text>
            </View>
          ) : (
            <View style={styles.cajadescripcion}>
              <Text style={styles.descripcion}></Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.cajaboton}>
        {is_following ? (
          <Pressable style={styles.button} onPress={unfollowUser}>
          <Text style={styles.buttonText}>Dejar de seguir</Text>
        </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={followUser}>
          <Text style={styles.buttonText}>Seguir</Text>
        </Pressable>
        )}
      </View>
      <View style={styles.cajainferior}>
        <View style={styles.cajaquien}>
          <Text style={styles.userinferior}>
            {getusuario ? getusuario : "--- "}
          </Text>
          <Text style={styles.mensaje}>estara en estos eventos ...</Text>
        </View>
      </View>
      <View style={styles.cajaeventos}>
        <EventListTopProfile usernameToget={getusuario as string}/>
      </View>
      <CustomModal
        onBackdropPress={toggleAlert}
        isVisible={isAlertVisible}
        toggleModal={toggleAlert}
        modalText={AlertText}
      />
      <Panel
        isVisible={isPanelVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(19, 19, 19, 1)",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  superior: {
    position: "relative",
    top: 0,
    width: "100%",
    height: "15%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  cajauser: {
    position: "absolute",
    bottom: "5%",
  },
  welcomeText: {
    fontStyle: "italic",
    color: "white",
    fontSize: proportionalFontSize(24),
  },
  middle: {
    flexDirection: "row", // Disposición horizontal
    height: "30%",
    top: "0%",
    width: "100%",
    position: "relative",
  },
  logo: {
    height: 50,
    width: 50,
    marginTop: "12%",
    position: "absolute",
  },
  cajafoto: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    width: "45%",
    height: "80%",
  },
  anadir: {
    position: "absolute",
    width: "15%",
    height: "15%",
    right: "0%",
    bottom: "0%",
  },
  profilePhoto: {
    marginLeft: "5%",
    marginTop: "5%",
    width: 150,
    height: 170,
    borderRadius: 55,
  },
  cajainfo: {
    position: "absolute",
    width: "55%",
    height: "90%",
    left: "45%",
    top: "0%",
  },
  cajaseguidores: {
    marginLeft: proportionalFontSize(5),
    top: "2%",
    width: "100%",
    height: "40%",
    flexDirection: "row",
  },
  seguidosinfo: {
    width: "40%",
    height: "60%",
    top: "10%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
  },
  seguidoresinfo: {
    width: "50%",
    marginLeft: "5%",
    height: "60%",
    top: "10%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
  },
  seguidostextcaja: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#373737",
    backgroundColor: "black",
  },
  seguidos: {
    color: "white",
    fontSize: proportionalFontSize(15),
  },
  seguidosvaluecaja: {
    alignItems: "center",
  },
  value: {
    color: "white",
    fontSize: proportionalFontSize(18),
  },
  cajadescripcion: {
    position: "absolute",
    width: "90%",
    height: "50%",
    left: "5%",
    top: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  descripcion: {
    textAlign: "center",
    color: "white",
    fontSize: proportionalFontSize(20),
    paddingHorizontal: 10, // Añade un poco de padding horizontal para evitar que el texto toque los bordes del contenedor
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
    flexShrink: 1, // Permite que el texto se reduzca en tamaño si es necesario para ajustarse al contenedor
  },
  editar: {
    position: "absolute",
    width: 20,
    height: 20,
    right: "10%",
    bottom: "10%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "50%",
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontSize: proportionalFontSize(16),
  },
  cajaboton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "40%",
    width: "100%",
    height: "10%",
  },
  cajainferior: {
    position: "absolute",
    width: "100%",
    height: "50%",
    top: "50%",
  },

  userinferior: {
    fontStyle: "italic",
    fontWeight: "bold",
    color: "white",
    fontSize: proportionalFontSize(16),
  },
  cajaquien: {
    marginLeft: "2%",
    alignItems: "center",
    flexDirection: "row",
  },
  mensaje: {
    marginLeft: "2%",
    color: "white",
    fontSize: proportionalFontSize(16),
  },
  cajahistorial: {
    position: "absolute",
    bottom: "5%",
    width: "100%",
    height: "20%",
  },
  cajaeventos: {
    position: "absolute",
    bottom: width > 375 ? "22%" : "25%", // Condicional para modificar la posición dependiendo del tamaño de la pantalla
    width: "100%",
    height: "25%",
  },
  cajaeventosimagenes: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  imageevents: {
    width: 90,
    height: 90,
    margin: 10,
  },
  cajaeventosfechas: {
    bottom: "0%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-around",
  },
  cajaeventoshistorialfechas: {
    bottom: "12%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-around",
  },
  whitetext: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  modalContent: {
    backgroundColor: "rgba(45, 10, 66, 1)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  inputCaja: {
    alignItems: "center",
    position: "relative",
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
    flexDirection: "row",
    marginBottom: "10%",
  },
  input: {
    marginTop: "5%",
    padding: "2%",
    color: "#fff",
    fontSize: 17,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  iconUser: {
    bottom: "10%",
    position: "absolute",
    right: "0%",
    width: 25,
    height: 25,
  },
  alertmodal: {
    padding: "5%",
    borderRadius: 40,
    backgroundColor: "rgba(45, 10, 66, 1)",
    alignItems: "center",
    width: "100%",
    height: "20%",
    position: "absolute",
    top: "35%",
    left: "0%",
  },
  modaltext: {
    color: "white",
    textAlign: "center",
    fontSize: proportionalFontSize(20),
    paddingHorizontal: 5, // Añade un poco de padding horizontal para evitar que el texto toque los bordes del contenedor
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
  },
  modaltextbutton: {
    color: "black",
    textAlign: "center",
    fontSize: proportionalFontSize(20),
    lineHeight: proportionalFontSize(24), // Aumenta la altura de línea para mejorar la legibilidad
  },
  gologin: {
    top: "70%",
    position: "absolute",
    justifyContent: "center",
    width: "60%",
    height: "35%",
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
  },
});
export default UserProfile;
