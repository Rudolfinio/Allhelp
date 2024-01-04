import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, SafeAreaView,StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox, ListItem } from "@rneui/themed";

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

const MyComponent = () => {
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

    console.log("Dane usunięte pomyślnie");
  } catch (error) {
    console.error("Błąd podczas usuwania danych:", error);
  }
};

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          {allergeny &&
            Object.keys(allergeny).map((key, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <CheckBox
                  checked={allergeny[key].value}
                  onPress={() => handleCheckboxChange(key)}
                  title={allergeny[key].english}
                />
              </View>
            ))}
          <Button title="Clear" onPress={() => clearData()} />
          <Button title="Clear Eaten" onPress={() => clearFromEat()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});
export default MyComponent;
