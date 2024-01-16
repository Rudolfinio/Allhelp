import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Modal,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Calendar } from "react-native-calendars";
import { Header, Button } from "@rneui/themed";
import { color } from "@rneui/base";

const buttonsData = [
  { icon: "angry", value: 1, color: "#F5F5F5" },
  { icon: "sad-tear", value: 2, color: "#F5F5F5" },
  { icon: "meh", value: 3, color: "#F5F5F5" },
  { icon: "smile", value: 4, color: "#F5F5F5" },
  { icon: "grin", value: 5, color: "#F5F5F5" },
];
const feel = ["Very bad", "Bad", "OK", "Good", "Great"];
const StatEat = ({ route, navigation }) => {
  const [eaten, setEaten] = useState([]);
  const [selected, setSelected] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [codeSel, setCodeSel] = useState(null);
  const [selectedDates, setSelectedDates] = useState({});
  const [wellbeing, setWellbeing] = useState("");
  const [notes, setNotes] = useState("");
  const [col, setColor] = useState("");
  const [icon, setIcon] = useState("");
  const [date, setDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [wellbeinged, setWellbeingEd] = useState("");
  const [notesed, setNotesEd] = useState("");
  const [widthF, setWidthF] = useState(0);
  useEffect(() => {
    const fetchDataAll = async () => {
      try {
        const existingData = await AsyncStorage.getItem("eat");

        if (existingData) {
          setEaten(JSON.parse(existingData));
        }
      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    };

    fetchDataAll();
  }, [eaten]);

  const handleButtonPress = (index) => {
    setSelectedButton(index);
    setWellbeingEd(buttonsData[index].value);
  };

  const handleNotesChange = (text) => setNotesEd(text);

  const handleItemPress = (code) => {
    setCodeSel(code);

    const productData = eaten.eat[code];
    const dates = Object.keys(productData).filter(
      (key) => key !== "productImageSmall" && key !== "productName"
    );

    const selected = {};
    dates.forEach((date) => {
      const foundObject = buttonsData.find(
        (item) => item.value === productData[date].wellbeing
      );
      selected[date] = {
        marked: true,
        dotColor: "black",
        selectedDotColor: "blue",
        disableTouchEvent: false,
      };
    });

    setSelectedDates(selected);

    openMenu();
  };
  const openMenu = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setNotes("");
    setWellbeing("");
    setColor("");
    setIcon("");
    setSelected(null);
    setModalVisible(false);
  };
  const edit = () => {
    setNotesEd(eaten.eat[codeSel][date]?.notes);
    const temp = eaten.eat[codeSel][date]?.wellbeing - 1;
    setSelectedButton(temp);
    setWellbeingEd(buttonsData[temp].value);
    setIsEditing(true);
  };
  const send = async () => {
    closeModal();
    try {
      const existingData = await AsyncStorage.getItem("eat");
      const dd = JSON.parse(existingData);

      dd.eat[codeSel][selected] = {
        wellbeing: wellbeinged,
        notes: notesed,
      };

      await AsyncStorage.setItem("eat", JSON.stringify(dd));

      setEaten(dd);
      setIsEditing(false);
    } catch (error) {
      console.error("Error accessing AsyncStorage:", error);
    }
    setNotesEd("");
    setWellbeingEd("");
    setSelectedButton(null);
  };

  const deleteDate = () => {
    const deleteEat = async () => {
      try {
        const existingData = await AsyncStorage.getItem("eat");
        const dd = JSON.parse(existingData);

        delete dd.eat[codeSel][date];

        const updatedSelectedDates = { ...selectedDates };
        delete updatedSelectedDates[date];

        setSelectedDates(updatedSelectedDates);

        const productData = dd.eat[codeSel];
        const dates = Object.keys(productData).filter(
          (key) => key !== "productImageSmall" && key !== "productName"
        );
        if (dates.length === 0) {
          delete dd.eat[codeSel];
        }

        await AsyncStorage.setItem("eat", JSON.stringify(dd));

      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    };

    deleteEat();
    handleItemPress(codeSel);
    setNotes("");
    setWellbeing("");
    setColor("");
    setIcon("");
    setSelected(null);
  };

  const info = (date) => {
    const foundObject = buttonsData.find(
      (item) => item.value === eaten.eat[codeSel][date]?.wellbeing
    );
    setNotes(
      eaten.eat[codeSel][date]?.notes ? eaten.eat[codeSel][date]?.notes : ""
    );
    setWellbeing(
      eaten.eat[codeSel][date]?.wellbeing
        ? feel[eaten.eat[codeSel][date]?.wellbeing - 1]
        : ""
    );
    //setWidthF(2);
    setDate(date);
    setColor(foundObject?.color ? "foundObject?.color" : "#F5F5F5");
    setIcon(foundObject?.icon ? foundObject?.icon : "");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          backgroundColor="#F5F5F5"
          centerComponent={{ text: "Statistics", style: styles.head }}
        />
        {(eaten.eat &&
          Object.keys(eaten.eat).length != 0 &&
          Object.keys(eaten.eat).map((code) => {
            const productData = eaten.eat[code];
            return (
              <TouchableOpacity
                key={code}
                onPress={() => handleItemPress(code)}
                style={styles.itemContainer}
              >
                <Image
                  style={styles.image}
                  source={{ uri: productData.productImageSmall }}
                  defaultSource={{ uri: "N/A" }}
                />
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={styles.listText}
                >
                  {productData.productName ? productData.productName : "N/A"}
                </Text>
              </TouchableOpacity>
            );
          })) || (
          <Text
            style={{
              textAlign: "center",
              marginTop: 50,
              color: "#212529",
              fontWeight: "800",
              fontSize: 20,
            }}
          >
            There is nothing to see here...
          </Text>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Calendar
                theme={{
                  backgroundColor: "#F5F5F5",
                  calendarBackground: "#F5F5F5",
                  selectedDayBackgroundColor: "blue",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "blue",
                  dayTextColor: "#424141",
                  arrowColor: "#424141",
                  monthTextColor: "#424141",
                  textDayFontSize: 16,
                  textMonthFontSize: 20,
                  textMonthFontWeight: "bold",
                  textDayFontWeight: "bold",
                  textDayHeaderFontSize: 16,
                  textSectionTitleColor: "#424141",
                  textDisabledColor: "#999e9e",
                }}
                onDayPress={(day) => {
                  setSelected(day.dateString);
                  info(day.dateString);
                }}
                markedDates={{
                  ...selectedDates,
                  [selected]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedDotColor: "blue",
                    marked: selectedDates[selected]?.marked,
                    dotColor: selectedDates[selected]?.dotColor,
                  },
                }}
              />
              {isEditing ? null : (
                <View>
                  <View style={styles.buttonsContainer2}>
                    <Text style={[styles.textD]}>
                      {wellbeing && "Wellbeing: "}
                      <Text style={styles.desc}>{wellbeing}</Text>
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          backgroundColor: col,
                          marginLeft: 50,
                          borderWidth: wellbeing ? 2 : 0,
                        },
                      ]}
                    >
                      <Icon name={icon} size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.textD, (textAlign = "left")]}>
                    {notes && "Notes: "}
                    <Text style={styles.desc}>{notes}</Text>
                  </Text>
                </View>
              )}
              {isEditing && (
                <View>
                  <View style={styles.buttonsContainer}>
                    {buttonsData.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.button,
                          {
                            backgroundColor: button.color,
                            opacity:
                              selectedButton === null ||
                              selectedButton === index
                                ? 1
                                : 0.5,
                            borderWidth: button ? 2 : 0,
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
                    value={notesed}
                    onChangeText={handleNotesChange}
                  />

                  <Button
                    buttonStyle={{
                      backgroundColor: "#2546f0",
                      borderWidth: 0,
                      borderColor: "transparent",
                      borderRadius: 15,
                    }}
                    onPress={send}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "800",
                        fontSize: 18,
                      }}
                    >
                      Save
                    </Text>{" "}
                  </Button>
                </View>
              )}
              {wellbeing && !isEditing && (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    justifyContent: "space-evenly",
                    width: "100%",
                  }}
                >
                  <Button
                    buttonStyle={{
                      backgroundColor: "#0073e6",
                      borderWidth: 0,
                      borderColor: "transparent",
                      borderRadius: 15,
                      width: 100,
                      height: 40,
                    }}
                    onPress={edit}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </Button>
                  <Button
                    buttonStyle={{
                      backgroundColor: "#0073e6",
                      borderWidth: 0,
                      borderColor: "transparent",
                      borderRadius: 15,
                      width: 100,
                      height: 40,
                      marginLeft: 20,
                    }}
                    onPress={deleteDate}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Button>
                </View>
              )}
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
  closeButtonContainer: {
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 90,
    resizeMode: "contain",
    justifyContent: "center",
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
  buttonsContainer2: {
    flexDirection: "row",
    // justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
    marginRight: 50,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 5,
    borderColor: "black",
    //borderWidth: widthF,
  },
  itemContainer: {
    height: 100,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "100%",
    //height: "100%",
    backgroundColor: "#F5F5F5",
    padding: 20,
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
  listText: {
    color: "#424141",
    fontWeight: "bold",
    fontSize: 16,
    width: "72%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  textD: {
    color: "#424141",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "left",
  },
  desc: {
    color: "#424141",
    fontWeight: "500",
    fontSize: 16,
  },
});
export default StatEat;
