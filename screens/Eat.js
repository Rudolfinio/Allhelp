import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  Button,
} from "react-native";
import { StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const eatInit = {
  eat: {},
};
const Eat = ({ route, navigation }) => {
  const buttonsData = [
    { icon: "angry", value: 1, color: "red" },
    { icon: "sad-tear", value: 2, color: "orange" },
    { icon: "meh", value: 3, color: "#FFD700" },
    { icon: "smile", value: 4, color: "lightgreen" },
    { icon: "grin", value: 5, color: "green" },
  ];

  const [selectedButton, setSelectedButton] = useState(null);
  const [selected, setSelected] = useState(true);
  const { Code, productName, productImageSmall } = route.params;
  const [wellbeing, setWellbeing] = useState("");
  const [notes, setNotes] = useState("");

  const handleButtonPress = (index) => {
    console.log(`Selected value: ${buttonsData[index].value}`);
    setSelectedButton(index);
    setWellbeing(buttonsData[index].value);
  };
  const handleNotesChange = (text) => {
    setNotes(text);
    console.log(notes);
  };

  const fetchDataAll = async () => {
    try {
      const existingData = await AsyncStorage.getItem("eat");
      console.log("existingData: ", existingData);
      const parsedData = existingData ? JSON.parse(existingData) : {};

      const currentDate = selected;
      const newData = {
        eat: {
          ...parsedData.eat,
          [Code]: {
            ...(parsedData.eat && parsedData.eat[Code]
              ? parsedData.eat[Code]
              : {}),
            productName: productName,
            productImageSmall: productImageSmall,
            [currentDate]: {
              wellbeing: wellbeing,
              notes: notes,
            },
          },
        },
      };

      await AsyncStorage.setItem("eat", JSON.stringify(newData));
      console.log("Eaten Data:", JSON.stringify(newData, null, 2));
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };
  const show = () => {
    console.log("Date: ", selected);
    console.log("Wellbeing:", wellbeing);
    console.log("Notes:", notes);
    fetchDataAll();
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Text>Eat Screen</Text>
          <Calendar
            onDayPress={(day) => {
              setSelected(day.dateString);
              console.log(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },
            }}
          />

          <View style={styles.buttonsContainer}>
            {buttonsData.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  {
                    backgroundColor: button.color,
                    opacity:
                      selectedButton === null || selectedButton === index
                        ? 1
                        : 0.5,
                  },
                ]}
                onPress={() => handleButtonPress(index)}
              >
                <Icon name={button.icon} size={24} color="white" />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Wpisz notatki..."
            multiline
            value={notes}
            onChangeText={handleNotesChange}
          />

          <Button onPress={show} title="wyslij" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textInput: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default Eat;
