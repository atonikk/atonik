import React, { useState, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import left from "../assets/images/left.png";
import right from "../assets/images/right.png";
import url from "../constants/url.json";
import EventItems from "./eventItemList";

const DateSelector = () => {
  const [absoluteDate, setAbsoluteDate] = useState(new Date());
  const [dailyEvents, setDailyEvents] = useState([]);
  const [monthlyEvents, SetMonthlyEvents] = useState([])
  const [month, setMonth] = useState(0)
  const [loading, setLoading] = useState(false); // Loading state added

  const addDays = (date: Date, days: number) => {
    const addDaysDate = new Date(date); 
    addDaysDate.setDate(addDaysDate.getDate() + days);
    return addDaysDate;
  };
  const formatDate = (date: Date) => {
   
    const formatDate1 = addDays(date, 1);
  
  
    const days = ["D", "L", "M", "M", "J", "V", "S"];

  
  
    // Devolver el día de la semana y el día del mes
    return [days[formatDate1.getDay()], formatDate1.getDate()];
  };

  function getEventsByDate(dateISO:Date, eventsArray:any) {
    dateISO = addDays(dateISO, 0)
    return eventsArray.filter(event => {
        const eventDate = new Date(event.date.$date).toISOString().split('T')[0];
        const inputDate = new Date(dateISO).toISOString().split('T')[0];
        return eventDate === inputDate;
    });
}

  const nextEvent = async () => {
    try {
      setLoading(true); // Set loading to true
      const response = await fetch(
        `${url.url}/api/events/next`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      const nextDate = new Date(data.next_event_date);
      setAbsoluteDate(nextDate);
      await fetchEventsOne(nextDate);
    } catch (error) {
      console.error("Error fetching next event:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  

  const fetchEventsOne = async (fetchDate: Date) => {
    try {
      setLoading(true); // Start loading when fetching
      const response = await fetch(
        `${url.url}/api/events/one?date=${fetchDate}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setDailyEvents(await response.json());
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false); // End loading after fetching
    }
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        await fetchEventsOne(absoluteDate);
        nextEvent();

      } catch (error) {
        console.error("Error fetching data on mount:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <View style={styles.allText}>
        <TouchableOpacity
      onPress={async () => {
        const newDate = addDays(absoluteDate, -1);
        await fetchEventsOne(newDate); // Ensure fetchEvents is completed first
        setAbsoluteDate(newDate);    // Ensure fetchEvents is completed first
  
      }}
          style={styles.rowContainer}
        >
          <Image source={left} style={styles.row} />
        </TouchableOpacity>

        {[-2, -1, 0, 1, 2].map(offset => (
  <TouchableOpacity
    key={offset}
    onPress={async () => {
      const newDate = addDays(absoluteDate, offset); // Cambiado 1 por offset
      await fetchEventsOne(newDate); 
      setAbsoluteDate(newDate);    
    }}
    style={[styles.textContainer, offset === 0 ? styles.middle : {}]}
  >
    <Text style={[styles.letter, offset === 0 ? styles.middleText : {}]}>
      {formatDate(addDays(absoluteDate, offset))[0]} 
    </Text>
    <Text style={[styles.num, offset === 0 ? styles.middleText : {}]}>
      {formatDate(addDays(absoluteDate, offset))[1]}
    </Text>
  </TouchableOpacity>
))}


        <TouchableOpacity
onPress={async () => {
  const newDate = addDays(absoluteDate, 1);
  await fetchEventsOne(newDate); // Ensure fetchEvents is completed first
  setAbsoluteDate(newDate);    // Then update the absoluteDate state
}}
          style={styles.rowContainer}
        >
          <Image source={right} style={styles.row} />
        </TouchableOpacity>

      </View>
      <EventItems 
        events={dailyEvents}
        state={"event"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  allText: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "0%",
    marginBottom: "5%",
  },
  rowContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    height: 45,
    width: 30,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 52,
  },
  letter: {
    fontSize: 25,
    fontWeight: "100",
    color: "white",
    textAlign: "center",
  },
  num: {
    fontSize: 27,
    color: "white",
    fontWeight: "100",
    textAlign: "center",
  },
  middleText: {
    backgroundColor: "#5A188D",
    borderRadius: 10,
    color: "white",
  },
  middle: {
    backgroundColor: "#5A188D",
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default DateSelector;
