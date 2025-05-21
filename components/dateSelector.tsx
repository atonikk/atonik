import React, { useState, useLayoutEffect } from "react";
import { Dimensions,View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import url from "../constants/url.json";
import EventItems from "./eventItemList";
import Carrousel from "@/components/carrouselHome";

const DateSelector = () => {
  const { height, width } = Dimensions.get('window');
  const [absoluteDate, setAbsoluteDate] = useState(new Date());
  const [dailyEvents, setDailyEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const addDays = (date, days) => {
    const addDaysDate = new Date(date); 
    addDaysDate.setDate(addDaysDate.getDate() + days);
    return addDaysDate;
  };

  const formatDate = (date) => {
    const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    return [days[date.getDay()], date.getDate()];
  };

  const getMonthName = (date) => { 
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]; 
    return months[date.getMonth()];
  };

  const fetchEventsOne = async (fetchDate) => {
    try {
      setLoading(true);
      const response = await fetch(`${url.url}/api/events/one?date=${fetchDate.toISOString()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      setDailyEvents(await response.json());
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchEventsOne(absoluteDate);
  }, [absoluteDate]);

  const handleDatePress = (offset) => {
    const newDate = addDays(absoluteDate, offset);
    setAbsoluteDate(newDate);
    fetchEventsOne(newDate);
  };

  const renderDateItem = ({ item }) => {
    const isActive = item === 0;
    const date = addDays(absoluteDate, item);
    const [day, num] = formatDate(date);

    return (
      <TouchableOpacity
      onPress={() => handleDatePress(item)}
      style={[styles.dateItem, isActive ? styles.activeDate : {}]}
    >
      <Text style={[styles.dateText, isActive ? styles.activeDateText : {}]}>
        {day}
      </Text>
      <Text style={[styles.dateText, isActive ? styles.activeDateText : {}]}>
        {num}
      </Text>
    </TouchableOpacity>
    
    );
  };

  return (
    <View style={styles.container}> 
   
        <Carrousel />
        <LinearGradient
  colors={["#5A2BCC", "#130E1E"]}
  style={[styles.gradient,{ height: height * 0.14 , width: width}]} // Ajusta la altura del gradiente
  
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 0.70 }}
  
>
  <FlatList
    data={[-3, -2, -1, 0, 1, 2, 3]}
    horizontal
    keyExtractor={(item) => item.toString()}
    renderItem={renderDateItem}
    contentContainerStyle={styles.dateList}
    showsHorizontalScrollIndicator={false}
    decelerationRate="fast"
  />
</LinearGradient>


 
      <EventItems events={dailyEvents} state={"event"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
   
  },
  gradient: {
    paddingVertical: 20,
   
    height:"30%",
    alignItems: "center",
    zIndex: -9,
  },
  dateList: {
    paddingVertical: 10,
    backgroundColor: "#00000",
  
  },
  dateItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
   
    marginHorizontal: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  activeDate: {
    backgroundColor: "#936fb152",
  },
  dateText: {
    fontSize: 17,
    color: "#ffffff",
    fontWeight: "200",
    textAlign: "center",
  },
  activeDateText: {
    color: "#fff",
  },
  monthContainer: {
    marginTop: 15,
  },
  monthText: {
    fontSize: 16,
    color: "#8c00ff",
  },
});

export default DateSelector;