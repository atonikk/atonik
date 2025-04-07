import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, SplashScreen, Tabs } from "expo-router";
import { Pressable, Image } from "react-native";
import homeIcon from "../../assets/images/Inicio.png";
import searchIcon from "../../assets/images/search.png";
import publishIcon from "../../assets/images/publish.png";
import profileIcon from "../../assets/images/icon.png";
import ticketIcon from "../../assets/images/ticket.png";
import Colors from "@/constants/Colors";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usershadow from "../../assets/images/userShadow.png";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [profile_photo, setProfilePhoto] = useState<string>("");
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    SplashScreen.hideAsync();
    const fetchProfilePhoto = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setToken(token);
          const decoded: any = jwtDecode(token);
          setProfilePhoto(decoded.sub.profile_photo);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    };
    fetchProfilePhoto();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          paddingBottom: 7,
          paddingTop: 10,
          backgroundColor: "#010b1c",
          height: 70,
        },
        headerShown: false,
        tabBarActiveTintColor: "#c494ff",
        tabBarInactiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={homeIcon}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={searchIcon}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: "Publish",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={publishIcon}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ticket"
        options={{
          title: "Ticket",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={ticketIcon}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size }) => (
            <Image
              source={profile_photo ? { uri: profile_photo } : usershadow}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
