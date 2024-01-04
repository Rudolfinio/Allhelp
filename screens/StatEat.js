import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  Modal,
  Alert,
  StatusBar,
  TouchableOpacity,
  Button,
} from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Calendar, LocaleConfig } from "react-native-calendars";
const buttonsData = [
  { icon: "angry", value: 1, color: "red" },
  { icon: "sad-tear", value: 2, color: "orange" },
  { icon: "meh", value: 3, color: "#FFD700" },
  { icon: "smile", value: 4, color: "lightgreen" },
  { icon: "grin", value: 5, color: "green" },
];
const StatEat = ({ route, navigation }) => {
  //const { code } = route.params;
  const [eaten, setEaten] = useState([]);
  const [selected, setSelected] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [codeSel, setCodeSel] = useState(null);
  const [selectedDates, setSelectedDates] = useState({});
  const [wellbeing, setWellbeing] = useState("");
  const [notes, setNotes] = useState("");
  const [col, setColor] = useState("");
  const [icon, setIcon] = useState("");
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
  }, []);
  useEffect(() => {
    // console.log("EATEN:", eaten);
  }, [eaten]);
  const markedDates = {};

  const handleItemPress = (code) => {
    setCodeSel(code);

    const productData = eaten.eat[code];
    const dates = Object.keys(productData).filter(
      (key) => key !== "productImageSmall" && key !== "productName"
    );

    const selected = {};
    dates.forEach((date) => {
      selected[date] = {
        //selected: false,
        marked: true,
        dotColor: "orange",
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
    setSelected(null);
    setModalVisible(false);
  };

  const info = (date) => {
    setNotes(
      eaten.eat[codeSel][date]?.notes
        ? "Notes: " + eaten.eat[codeSel][date]?.notes
        : ""
    );
    setWellbeing(
      eaten.eat[codeSel][date]?.wellbeing
        ? "Wellbeing: " + eaten.eat[codeSel][date]?.wellbeing
        : ""
    );

    const foundObject = buttonsData.find(
      (item) => item.value === eaten.eat[codeSel][date]?.wellbeing
    );
    setColor(foundObject.color);
    setIcon(foundObject.icon);
    console.log(wellbeing);
    console.log(col);
    console.log(icon);
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
              <View style={styles.buttonsContainer}>
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
              <Text>{wellbeing}</Text>
              <Text>{notes}</Text>
              <Button title="Close" onPress={closeModal} />
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
});
export default StatEat;
