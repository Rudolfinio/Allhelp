import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox, Header } from "@rneui/themed";

const allergen = {
  Gluten: { english: "Gluten", polish: "Gluten", value: false },
  Shellfish: { english: "Shellfish", polish: "Skorupiaki", value: false },
  Eggs: { english: "Eggs", polish: "Jajka", value: false },
  Fish: { english: "Fish", polish: "Ryby", value: false },
  Peanuts: { english: "Peanuts", polish: "Orzeszki ziemne", value: false },
  Soybeans: { english: "Soybeans", polish: "Soja", value: false },
  Milk: { english: "Milk", polish: "Mleko", value: false },
  "Sesame-seeds": { english: "Sesame seeds", polish: "Sezam", value: false },
  Nuts: { english: "Nuts", polish: "Orzechy", value: false },
  Celery: { english: "Celery", polish: "Seler", value: false },
  Sulfites: { english: "Sulfites", polish: "Siarczyny", value: false },
  Lupin: { english: "Lupin", polish: "Łubin", value: false },
  Mollusks: { english: "Mollusks", polish: "Mięczaki", value: false },
};

const User = ({ route, navigation }) => {
  const [allergeny, setAllergeny] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedAllergens = await AsyncStorage.getItem("allergens2");

        if (storedAllergens) {
          setAllergeny(JSON.parse(storedAllergens));
        } else {
          await AsyncStorage.setItem("allergens2", JSON.stringify(allergen));
          setAllergeny(allergen);
        }
      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    };
    fetchData();
  }, []);
  const handleCheckboxChange = (key) => {
    const updatedAllergens = {
      ...allergeny,
      [key]: { ...allergeny[key], value: !allergeny[key].value },
    };
    console.log(updatedAllergens);
    setAllergeny(updatedAllergens);

    AsyncStorage.setItem("allergens2", JSON.stringify(updatedAllergens));
  };

  const clearData = async () => {
    try {
      await AsyncStorage.clear();
      setAllergeny(allergen);
      await AsyncStorage.setItem("allergens2", JSON.stringify(allergen));
    } catch (e) {
      console.error(e);
    }
  };
  const clearFromEat = async () => {
    try {
      await AsyncStorage.removeItem("eat");
      //setDeleted(true);

      console.log("Dane usunięte pomyślnie");
    } catch (error) {
      console.error("Błąd podczas usuwania danych:", error);
    }
  };
  const clearFromHistory = async () => {
    try {
      await AsyncStorage.removeItem("history");

      console.log("Dane usunięte pomyślnie");
    } catch (error) {
      console.error("Błąd podczas usuwania danych:", error);
    }
    // setDeleted(true);
  };
  const clearFromFav = async () => {
    try {
      await AsyncStorage.removeItem("fav");

      console.log("Dane usunięte pomyślnie");
    } catch (error) {
      console.error("Błąd podczas usuwania danych:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header
        backgroundColor="#F5F5F5"
        centerComponent={{ text: "User", style: styles.head }}
      />
      <ScrollView style={styles.scrollViewContainer}>
        {allergeny &&
          Object.keys(allergeny).map((key, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <CheckBox
                style={styles.chbox}
                checked={allergeny[key].value}
                onPress={() => handleCheckboxChange(key)}
                title={allergeny[key].english}
                textStyle={{ backgroundColor: "#F5F5F5", color: "#424141" }}
                wrapperStyle={{ backgroundColor: "#F5F5F5" }}
                containerStyle={{ backgroundColor: "#F5F5F5" }}
                checkedColor="#0073e6"
                uncheckedColor="#404f4f"
              />
            </View>
          ))}
      </ScrollView>
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.bottomButtonL}
          onPress={() => clearData()}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => clearFromEat()}
        >
          <Text style={styles.buttonText}>Clear Eaten</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => clearFromHistory()}
        >
          <Text style={styles.buttonText}>Clear History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButtonR}
          onPress={() => clearFromFav()}
        >
          <Text style={styles.buttonText}>Clear Fav</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  head: {
    color: "#292828",
    fontWeight: "bold",
    fontSize: 20,
  },
  scrollViewContainer: {
    flex: 1,
    marginBottom: 80,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderWidth: 0,
    borderColor: "transparent",
    height: 70,
  },
  bottomButtonL: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 25,
    borderWidth: 0,
    borderColor: "transparent",
    borderTopLeftRadius: 15,
    height: 70,
  },
  bottomButtonR: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderWidth: 0,
    borderColor: "transparent",
    borderTopRightRadius: 15,
    height: 70,
  },
  buttonText: {
    color: "#292828",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  chbox: {
    backgroundColor: "#ddbea9",
  },
});

export default User;
