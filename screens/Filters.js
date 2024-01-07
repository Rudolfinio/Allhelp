import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header, CheckBox, ListItem } from "@rneui/themed";

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
const traces = {
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
const FiltersScreen = ({ navigation }) => {
  const [productName, setProductName] = useState(null);
  const [productImage, setProductImage] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [allergeny, setAllergeny] = useState([]);
  const [trace, setTraces] = useState([]);
  const [allergensTags, setallergensTags] = useState("");
  const [tracesTags, setTracesTags] = useState("");
  const [allergensTagsTable, setallergensTagsTable] = useState([]);
  const [tracesTagsTable, setTracesTagsTable] = useState([]);
  const apiUrl = `https://world.openfoodfacts.net/api/v2/search?allergens_tags=${allergensTags}&traces_tags=${tracesTags}&fields=selected_images,product_name,code,allergens_from_ingredients,traces,allergens_tags&sort_by=unique_scans_n&page_size=24`;
  //zapamietac by zrobic by trace tez szukalo
  const [Pages, setPages] = useState(null);
  useEffect(() => {
    setAllergeny(allergen);
    setTraces(traces);
    fetchData(apiUrl);
  }, []);
  useEffect(() => {
    fetchData(apiUrl);
  }, [allergensTags, tracesTags]);
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const data = await response.json();
      setProductData(data.products);
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  const openMenu = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleCheckboxChange = (key) => {
    console.log("SIEMA!");
    const updatedAllergensTable = [...allergensTagsTable];
    const updatedAllergens = {
      ...allergeny,
      [key]: { ...allergeny[key], value: !allergeny[key].value },
    };
    const index = updatedAllergensTable.indexOf(allergeny[key].english);

    setAllergeny(updatedAllergens);

    if (index === -1) {
      updatedAllergensTable.push(allergeny[key].english);
    } else {
      updatedAllergensTable.splice(index, 1);
    }

    const allergensString = updatedAllergensTable.join(",");

    setallergensTagsTable(updatedAllergensTable);
    setallergensTags(allergensString);
    console.log(allergensString);
    console.log(apiUrl);
    // fetchData(apiUrl);
  };

  const handleCheckboxChangeTraces = (key) => {
    console.log("SIEMA2!");
    const updatedAllergensTable = [...tracesTagsTable];
    const updatedAllergens = {
      ...trace,
      [key]: { ...trace[key], value: !trace[key].value },
    };
    const index = updatedAllergensTable.indexOf(trace[key].english);

    setTraces(updatedAllergens);

    if (index === -1) {
      updatedAllergensTable.push(trace[key].english);
    } else {
      updatedAllergensTable.splice(index, 1);
    }

    const allergensString = updatedAllergensTable.join(",");

    setTracesTagsTable(updatedAllergensTable);
    setTracesTags(allergensString);
    console.log(allergensString);
    console.log(apiUrl);
    // fetchData(apiUrl);
  };
  const handleItemPress = (code) => {
    // Call the callback function to navigate to the Product screen
    console.log("Pressed item with code:", code); // Check if the code is logged correctly
    console.log("Navigating to Product screen with code:", code); // Check if the code is logged correctly

    navigateToProduct(code);
  };
  const handleOverlayPress = () => {
    closeModal();
  };
  const navigateToProduct = (code) => {
    navigation.navigate("Product", { code });
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Header
            rightComponent={{
              icon: "menu",
              color: "#fff",
              onPress: openMenu,
            }}
            centerComponent={{ text: "Filters Screen", style: styles.heading }}
          />
          {error ? (
            <Text>Error: {error}</Text>
          ) : (
            <View>
              {productData.map((product, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    onPress={() => handleItemPress(product.code)}
                    style={styles.itemContainer}
                  >
                    <Image
                      style={styles.image}
                      source={{
                        uri: product.selected_images?.front?.small[
                          Object.keys(product.selected_images.front.small)[0]
                        ],
                      }}
                      defaultSource={{ uri: "N/A" }}
                    />
                    <Text>
                      {product.product_name ? product.product_name : "N/A"}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          )}
          <Button
            title="Go back to Home"
            onPress={() => navigation.navigate("Home")}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
          >
            <ScrollView>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        style={{ fontWeight: "bold", flex: 1, fontSize: 17 }}
                      >
                        Name
                      </Text>
                      <Text
                        style={{ fontWeight: "bold", flex: 1, fontSize: 17 }}
                      >
                        Allergen
                      </Text>
                      <Text
                        style={{ fontWeight: "bold", flex: 1, fontSize: 17 }}
                      >
                        Traces
                      </Text>
                    </View>
                    {allergeny &&
                      Object.keys(allergeny).map((key, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            paddingHorizontal: 10,
                          }}
                        >
                          <Text
                            style={{
                              flex: 1,
                              marginRight: 5,
                              fontWeight: "bold",
                            }}
                          >
                            {allergeny[key].english}
                          </Text>
                          <CheckBox
                            checked={allergeny[key].value}
                            onPress={() => handleCheckboxChange(key)}
                          />
                          <CheckBox
                            checked={trace[key].value}
                            onPress={() => handleCheckboxChangeTraces(key)}
                          />
                        </View>
                      ))}
                    <Button title="Search" onPress={closeModal} />
                  </View>
                  
                </View>
                
            </ScrollView>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FiltersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  listItem: {
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#ffffff", // Dostosuj kolor tła
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc", // Dostosuj kolor obramowania
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    justifyContent: "center",
    marginRight: 10,
  },
  itemContainer: {
    backgroundColor: "#455561",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "70%",
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
  },
});
