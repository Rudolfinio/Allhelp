import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Modal,
  StatusBar,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Calendar } from "react-native-calendars";
const buttonsData = [
  { icon: "angry", value: 1, color: "red" },
  { icon: "sad-tear", value: 2, color: "orange" },
  { icon: "meh", value: 3, color: "#FFD700" },
  { icon: "smile", value: 4, color: "lightgreen" },
  { icon: "grin", value: 5, color: "green" },
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
        dotColor: foundObject.color,
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

        // Usuń wybraną datę
        delete dd.eat[codeSel][date];

        // Aktualizuj selectedDates
        const updatedSelectedDates = { ...selectedDates };
        delete updatedSelectedDates[date];

        // Zastosuj zmiany do stanu
        setSelectedDates(updatedSelectedDates);

        // Jeśli nie ma już dat dla tego produktu, usuń cały wpis
        const productData = dd.eat[codeSel];
        const dates = Object.keys(productData).filter(
          (key) => key !== "productImageSmall" && key !== "productName"
        );
        if (dates.length === 0) {
          delete dd.eat[codeSel];
        }

        // Zapisz zmiany w AsyncStorage
        await AsyncStorage.setItem("eat", JSON.stringify(dd));

        // Odśwież widok
      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    };

    deleteEat();
    handleItemPress(codeSel);
    setNotes("");
    setWellbeing("");
    setColor("white");
    setIcon("");
    setSelected(null);
  };

  const info = (date) => {
    const foundObject = buttonsData.find(
      (item) => item.value === eaten.eat[codeSel][date]?.wellbeing
    );
    setNotes(
      eaten.eat[codeSel][date]?.notes
        ? "Notes: " + eaten.eat[codeSel][date]?.notes
        : ""
    );
    setWellbeing(
      eaten.eat[codeSel][date]?.wellbeing
        ? "Wellbeing: " + feel[eaten.eat[codeSel][date]?.wellbeing - 1]
        : ""
    );
    setDate(date);
    setColor(foundObject?.color ? foundObject?.color : "white");
    setIcon(foundObject?.icon ? foundObject?.icon : "");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>StatEat Screen</Text>

        {eaten.eat &&
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
                <Text>
                  {productData.productName ? productData.productName : "N/A"}
                </Text>
              </TouchableOpacity>
            );
          })}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Calendar
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
                  <View style={styles.buttonsContainer}>
                    <Text>{wellbeing}</Text>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          backgroundColor: col,
                        },
                      ]}
                    >
                      <Icon name={icon} size={24} color="white" />
                    </TouchableOpacity>
                  </View>

                  <Text>{notes}</Text>
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
                    value={notesed}
                    onChangeText={handleNotesChange}
                  />
                  <Button title="wyslij" onPress={send} />
                </View>
              )}
              <View style={styles.closeButtonContainer}>
                <Button title="Edit" onPress={edit} />
                <Button title="Delete" onPress={deleteDate} />
                <Button title="Close" onPress={closeModal} />
              </View>
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
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  closeButtonContainer: {
    marginTop: 20, // Dodaj margines od góry, aby oddzielić przycisk od innych elementów
    //alignSelf: "center", // Umieść przycisk "Close" na środku ekranu (opcjonalne)
  },
  image: {
    width: 100,
    height: 100,
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
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  itemContainer: {
    backgroundColor: "#455561",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    padding: 20,
  },
  textInput: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
export default StatEat;
