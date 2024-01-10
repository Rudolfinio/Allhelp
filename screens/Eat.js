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
  Modal,
  Pressable,
} from "react-native";
import { StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header, Button } from "@rneui/themed";

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
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(true);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          backgroundColor="#6b705c"
          centerComponent={{ text: "Eat", style: styles.head }}
        />
        <ScrollView>
          <Calendar
            theme={{
              backgroundColor: "#ffe8d6",
              calendarBackground: "#ffe8d6",
              selectedDayBackgroundColor: "#6b705c",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "blue",
              dayTextColor: "#6b705c",
              arrowColor: "#6b705c",
              monthTextColor: "#6b705c",
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 16,
              textSectionTitleColor: "#a5a58d",
              textDisabledColor: "#ddbea9",
            }}
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
          <View>
            <Button
              onPress={show}
              buttonStyle={{
                backgroundColor: "#b98b73",
                borderWidth: 0,
                borderColor: "transparent",
                borderRadius: 15,
                width: "90%", // Szerokość przycisku
                alignSelf: "center", // Wyśrodkowanie przycisku wzdłuż osi głównej
              }}
            >
              <Text
                style={{
                  color: "#ffe8d6",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Save
              </Text>
            </Button>
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalText, { fontSize: 20 }]}>
                Information!
              </Text>
              <Text style={styles.modalText}>Product added.</Text>
              <Pressable
                style={[styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe8d6",
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
    borderColor: "#cb997e",
    borderRadius: 5,
    color: "#6b705c",
    fontWeight: "700",
    fontSize: 16,
  },
  head: {
    color: "#ffe8d6",
    fontWeight: "bold",
    fontSize: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ddbea9",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#6b705c",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 15,
    width: 150,
    elevation: 2,
    height: 40,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#da5872",
    fontSize: 16,
  },
  textStyle: {
    color: "#ffe8d6",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Eat;
