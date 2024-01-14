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
    { icon: "angry", value: 1, color: "white" },
    { icon: "sad-tear", value: 2, color: "white" },
    { icon: "meh", value: 3, color: "white" },
    { icon: "smile", value: 4, color: "white" },
    { icon: "grin", value: 5, color: "white" },
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
          backgroundColor="#F5F5F5"
          centerComponent={{ text: "Eat", style: styles.head }}
        />
        <ScrollView>
          <Calendar
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              selectedDayBackgroundColor: "blue",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "blue",
              dayTextColor: "#424141",
              arrowColor: "#424141",
              monthTextColor: "#424141",
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 16,
              textSectionTitleColor: "#424141",
              textDisabledColor: "#999e9e",
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
                <Icon name={button.icon} size={24} color="black" />
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
                backgroundColor: "#0073e6",
                borderWidth: 0,
                borderColor: "transparent",
                borderRadius: 15,
                width: "90%",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
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
    backgroundColor: "#ffffff",
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
    borderColor: "black",
    borderWidth: 2,
  },
  textInput: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#424141",
    borderRadius: 5,
    color: "#424141",
    fontWeight: "500",
    fontSize: 16,
  },
  head: {
    color: "#292828",
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
    backgroundColor: "#F5F5F5",
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
    backgroundColor: "#0073e6",
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
    color: "white",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Eat;
