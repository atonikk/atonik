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
  Platform,
  Button,
  ActionSheetIOS,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import {
  useNavigation,
  useFocusEffect,
  router,
  useLocalSearchParams,
} from "expo-router";
import url from "@/constants/url.json";
import { RootStackParamList } from "@/app/_layout";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import Modal from "react-native-modal";
import Panel from "@/components/panelPushUp";
import CustomModal from "@/components/modalAlert";
import EventListProfile from "@/components/eventListTopProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
const { width, height } = Dimensions.get("window");
import { useProfilePhotoStore } from "@/app/utils/useStore";
const proportionalFontSize = (size: number) => {
  const baseWidth = 375; // Ancho base (puedes ajustarlo según tus necesidades)
  return (size * width) / baseWidth;
};

const Profile: React.FC = () => {
  const profilePhoto = useProfilePhotoStore.getState().profilePhoto;
  const setProfilePhoto = useProfilePhotoStore.getState().setProfilePhoto;

  const [isModalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [descriptionProfile, setdescriptionProfile] = useState<string | null>(
    null
  );
  const [followers, setFollowers] = useState<string | null>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [updateImage, setUpdateImage] = useState<string | null>(null);
  const [newDescription, setnewDescription] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [AlertText, setAlertText] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  const showModalAlert = (message: string) => {
    setAlertText(message);
    setAlertVisible(true);
  };
  const toggleAlert = () => {
    setAlertVisible(!isAlertVisible);
  };
  const togglePanel = () => {
    setIsVisible((prev) => !prev);
  };

  const closePanel = () => {
    setIsVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const checkToken = async () => {
    console.log("Verificando token...");
    try {
      const storedToken = await AsyncStorage.getItem("access_token");
      console.log("Token almacenado:", storedToken);
      if (storedToken !== null) {
        const decoded: any = jwtDecode(storedToken);
        setToken(storedToken);
        setUsername(decoded.sub.username);
        console.log("Decoded token:", decoded);
        setPhoto(decoded.sub.profile_photo);
        fetchUserData(decoded.sub.username, storedToken);
      } else {
        setToken(null);
        setIsVisible(true);
      }
    } catch (error) {
      console.error("Error al verificar el token", error);
    }
  };
  const cleanData = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      setdescriptionProfile(null);
      setPhoto(null);
      setUsername(null);
      setProfilePhoto("");
      setFollowers(null);
      setFollowing(null);
      setDecodedToken(null);
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/home",
        });
      }, 1500);
    } catch (error) {
      console.error("Error al limpiar datos", error);
      router.push("/screens/Account/Login");
    }
  };

  const fetchUserData = async (user: string, token: string) => {
    const finalUsername = user;
    try {
      const response = await fetch(
        `${url.url}/api/get_myuser_details?username=${encodeURIComponent(
          finalUsername
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setdescriptionProfile(data.description);
        setProfilePhoto(data.profile_photo);
        setFollowers(data.followersnum);
        setFollowing(data.followingnum);
      } else {
        const errorData = await response.json();
        cleanData();
        console.log("Error data:", errorData);
        showModalAlert(
          "Tu sesion ha caducado por favor inicia sesion de nuevo"
        );
      }
    } catch (error) {
      showModalAlert("Ha habido un error de conexion");
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      checkToken();
      if (!token) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, [token])
  );

  const pickImage = async () => {
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (galleryStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Error",
        "Necesitas permisos para acceder a la galería y la cámara"
      );
      return;
    }

    const showOptions = async () => {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancelar", "Abrir galería", "Tomar foto"],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              await openGallery();
            } else if (buttonIndex === 2) {
              await openCamera();
            }
          }
        );
      } else {
        const response = await new Promise((resolve) => {
          Alert.alert(
            "Seleccionar una opción",
            "Elige cómo quieres añadir tu imagen",
            [
              {
                text: "Cancelar",
                style: "cancel",
                onPress: () => resolve(null),
              },
              { text: "Abrir galería", onPress: () => resolve("gallery") },
              { text: "Tomar foto", onPress: () => resolve("camera") },
            ]
          );
        });

        if (response === "gallery") {
          await openGallery();
        } else if (response === "camera") {
          await openCamera();
        }
      }
    };

    const openGallery = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [3, 3],
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];

        uploadImage(uri, username ? username : "user");
      }
    };

    const openCamera = async () => {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
        aspect: [3, 3],
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];
        setImageUri(uri);
        uploadImage(uri, username ? username : "user");
      }
    };

    await showOptions();
  };
  const uploadImage = async (imageUri: string, fileName: string) => {
    console.log("Subiendo imagen", fileName);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: `${fileName}.jpg`, // Nombre del archivo con extensión
        type: "image/jpeg", // Tipo MIME del archivo
      });
      const response = await axios.post(`${url.url}/upload_photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Imagen subida con éxito");
        setPhoto(imageUri);
      } else {
        console.log("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error en la subida de imagen", error);
    }
  };
  const updateDescription = async () => {
    try {
      const response = await fetch(`${url.url}/api/upload_description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newDescription,
          username: username,
        }),
      });
      if (response.ok) {
        closeModal();
        setdescriptionProfile(newDescription);
      }
    } catch (error) {
      console.error("Error al actualizar la descripción", error);
      Alert.alert("Error", "No se pudo actualizar la descripción");
    }
  };
  const deleteaccount = async () => {
    try {
      const response = await fetch(`${url.url}/api/delete_account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: username,
        }),
      });
      if (response.ok) {
        Alert.alert("Se ha eliminado la cuenta");

        cleanData();
      }
    } catch (error) {
      console.error("Error al eliminar la cuenta", error);
      Alert.alert("Error", "No se pudo eliminar la cuenta");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.superior}>
        {token ? (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{
              position: "absolute",
              left: "2%",
              height: 40,
              width: 40,
              top: "0%",
            }}
          >
            <Image
              source={require("@/assets/images/drawer2.png")}
              style={{ resizeMode: "contain", width: 40, height: 40 }}
            />
          </Pressable>
        ) : null}

        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.cajauser}>
          <Text style={styles.welcomeText}>{username ? username : ""}</Text>
        </View>
      </View>
      <View style={styles.middle}>
        {photo ? (
          <View style={styles.cajafoto}>
            <Image source={{ uri: photo }} style={styles.profilePhoto} />
            <Pressable
              onPress={pickImage}
              style={({ pressed }) => [
                {
                  transform: pressed ? [{ scale: 0.8 }] : [{ scale: 1 }],
                  opacity: pressed ? 0.8 : 1,
                },
                styles.anadir,
              ]}
            >
              <Image
                source={require("@/assets/images/add.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  right: "0%",
                  bottom: "0%",
                }}
              />
            </Pressable>
          </View>
        ) : (
          <View style={styles.cajafoto}>
            <Image
              source={require("@/assets/images/userShadow.png")}
              style={styles.profilePhoto}
            />
            {/* <Pressable
              onPress={() => {
                cleanData();
              }}
              // onPress={pickImage}
              style={({ pressed }) => [
                {
                  transform: pressed ? [{ scale: 0.8 }] : [{ scale: 1 }],
                  opacity: pressed ? 0.8 : 1,
                },
                styles.anadir,
              ]}
            >
              <Image
                source={require("@/assets/images/add.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  right: "0%",
                  bottom: "0%",
                }}
              />
            </Pressable> */}
          </View>
        )}
        <View style={styles.cajainfo}>
          <View style={styles.cajaseguidores}>
            <View style={styles.seguidosinfo}>
              <View style={styles.seguidostextcaja}>
                <Text style={styles.seguidos}>SEGUIDOS</Text>
              </View>
              <View style={styles.seguidosvaluecaja}>
                {following !== null ? (
                  <Text style={styles.value}>{following}</Text>
                ) : (
                  <Text style={styles.value}></Text>
                )}
              </View>
            </View>
            <View style={styles.seguidoresinfo}>
              <View style={styles.seguidostextcaja}>
                <Text style={styles.seguidos}>SEGUIDORES</Text>
              </View>
              <View style={styles.seguidosvaluecaja}>
                {following !== null ? (
                  <Text style={styles.value}>{followers}</Text>
                ) : (
                  <Text style={styles.value}></Text>
                )}
              </View>
            </View>
          </View>
          {descriptionProfile === null ? (
            <View style={styles.cajadescripcion}>
              <Text style={styles.descripcion}></Text>
            </View>
          ) : (
            <View style={styles.cajadescripcion}>
              <Text style={styles.descripcion}>{descriptionProfile}</Text>
              <Pressable
                onPress={openModal}
                style={({ pressed }) => [
                  {
                    transform: pressed ? [{ scale: 0.8 }] : [{ scale: 1 }],
                    opacity: pressed ? 0.8 : 1,
                  },
                  styles.editar,
                ]}
              >
                <Image source={require("@/assets/images/editar.png")} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      {username ? (
        <View style={styles.cajaboton}>
          <Pressable onPress={cleanData} style={styles.button}>
            <Text style={styles.buttonText}>Cerrar sesion</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.cajaboton}></View>
      )}
      <CustomModal
        onBackdropPress={toggleAlert}
        isVisible={isAlertVisible}
        toggleModal={toggleAlert}
        modalText={AlertText}
      />
      <View style={styles.cajainferior}>
        {username ? (
          <View style={styles.cajaquien}>
            <Text style={styles.userinferior}>{username ? username : ""}</Text>
            <Text style={styles.mensaje}>estara en estos eventos ...</Text>
          </View>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.cajaeventos}>
        {/* {username ? (
          <EventListProfile usernameToget={username ? username : ""} />
        ) : (
          <Text>Esta vacio por aqui ...</Text>
        )} */}
      </View>
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.whitetext}>Editar Descripcion</Text>
          <View style={styles.inputCaja}>
            <TextInput
              placeholderTextColor="#7C7C7C"
              style={styles.input}
              placeholder="Escribe la nueva descripción "
              onChangeText={setnewDescription}
            />
            <Image
              source={require("@/assets/images/editar.png")}
              style={styles.iconUser}
            />
          </View>
          <View style={styles.modalButtons}>
            <Pressable onPress={updateDescription} style={styles.saveButton}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>

            <Pressable onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Panel
        isVisible={isVisible}
        togglePanel={togglePanel}
        closePanel={closePanel}
      />
    </SafeAreaView>
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
    top: "1%",
    marginBottom: "5%",
    width: "100%",
    height: "13%",
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
    marginTop: "0%",
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
    top: "0%",
    height: 50,
    width: 50,
    marginTop: width > 375 ? "0%" : "7%",
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
    height: width > 375 ? "85%" : "60%",
    top: "10%",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
  },
  seguidoresinfo: {
    width: "50%",
    marginLeft: "5%",
    height: width > 375 ? "85%" : "60%",
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
    top: width > 375 ? "55%" : "30%",
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
    width: "60%",
    height: "45%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
  },
  button2: {
    alignItems: "center",
    flexDirection: "row",
    margin: "5%",
    position: "absolute",
    width: "40%",
    height: "45%",
    backgroundColor: "#f9342b",
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontSize: proportionalFontSize(16),
  },
  cajaboton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "15%",
    marginTop: "-2%",
  },
  cajainferior: {
    position: "absolute",
    width: "100%",
    height: "50%",
    top: height * 0.45,
  },

  userinferior: {
    fontStyle: "italic",
    fontWeight: "bold",
    color: "white",
    fontSize: proportionalFontSize(16),
  },
  cajaquien: {
    top: "27%",
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
    height: "20%",
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

export default Profile;
