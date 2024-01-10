import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Header, CheckBox, ListItem, Button } from "@rneui/themed";

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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);

  const apiUrl = `https://world.openfoodfacts.org/api/v2/search?allergens_tags=${allergensTags}&traces_tags=${tracesTags}&fields=selected_images,product_name,code,allergens_from_ingredients,traces,allergens_tags&sort_by=unique_scans_n&page_size=24&page=${page}`;

  useEffect(() => {
    setAllergeny(allergen);
    setTraces(traces);
    fetchData(apiUrl);
  }, []);
  useEffect(() => {
    fetchData(apiUrl);
  }, [allergensTags, tracesTags, page]);
  const fetchData = async (url) => {
    console.log(apiUrl);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const data = await response.json();
      if (page >= 2) {
        console.log("2");
        setProductData((prevProductData) => [
          ...prevProductData,
          ...data.products,
        ]);
      } else {
        console.log("1");

        setProductData(data.products);
      }
      setPages(data.page_count);
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
    setPage(1);

    setallergensTagsTable(updatedAllergensTable);
    setallergensTags(allergensString);
    console.log(allergensString);
    console.log(apiUrl);
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
    setPage(1);
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

  const navigateToProduct = (code) => {
    navigation.navigate("Product", { code, fromFilterScreen: true });
  };

  const handleEndReached = () => {
    // Load more data when the end of the list is reached
    if (page < pages) {
      setPage((prevPage) => prevPage + 1);
    }
    console.log("??");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          backgroundColor="#6b705c"
          rightComponent={{
            icon: "menu",
            color: "#ffe8d6",
            onPress: openMenu,
          }}
          centerComponent={{ text: "Filters", style: styles.head }}
        />
        <ScrollView>
          {error ? (
            <Text>Error: {error}</Text>
          ) : (
            <View>
              {productData.map((product, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    key={index}
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
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={2}
                      style={styles.listText}
                    >
                      {product.product_name ? product.product_name : "N/A"}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          )}
          <Button
            title="Next"
            buttonStyle={{
              flex: 1,
              backgroundColor: "#6b705c",
              padding: 13,
              borderWidth: 0,
              borderColor: "transparent",
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              marginTop: 10,
            }}
            onPress={handleEndReached}
          >
            <Text
              style={{
                color: "#ffe8d6",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Next
            </Text>
          </Button>

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
                      style={{
                        fontWeight: "800",
                        flex: 1,
                        fontSize: 17,
                        color: "#3f4238",
                      }}
                    >
                      Name
                    </Text>
                    <Text
                      style={{
                        fontWeight: "800",
                        flex: 1,
                        fontSize: 17,
                        color: "#3f4238",
                      }}
                    >
                      Allergen
                    </Text>
                    <Text
                      style={{
                        fontWeight: "800",
                        flex: 1,
                        fontSize: 17,
                        color: "#3f4238",
                      }}
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
                            color: "#6b705c",
                            fontWeight: "700",
                            fontSize: 15,
                          }}
                        >
                          {allergeny[key].english}
                        </Text>
                        <CheckBox
                          checked={allergeny[key].value}
                          onPress={() => handleCheckboxChange(key)}
                          wrapperStyle={{ backgroundColor: "#ddbea9" }}
                          containerStyle={{ backgroundColor: "#ddbea9" }}
                          checkedColor="#6b705c"
                          uncheckedColor="#bc6c25"
                        />
                        <CheckBox
                          checked={trace[key].value}
                          onPress={() => handleCheckboxChangeTraces(key)}
                          wrapperStyle={{ backgroundColor: "#ddbea9" }}
                          containerStyle={{ backgroundColor: "#ddbea9" }}
                          checkedColor="#6b705c"
                          uncheckedColor="#bc6c25"
                        />
                      </View>
                    ))}
                  <Button
                    onPress={closeModal}
                    buttonStyle={{
                      backgroundColor: "#6b705c",
                      borderWidth: 0,
                      borderColor: "transparent",
                      borderRadius: 15,
                      width: 150,
                      height: 40,
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
                      Close
                    </Text>
                  </Button>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FiltersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe8d6",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 90,
    resizeMode: "contain",
    justifyContent: "center",
    marginRight: 10,
  },
  itemContainer: {
    backgroundColor: "#ddbea9",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    height: 100,
    borderRadius: 10,
  },
  listText: {
    color: "#6b705c",
    fontWeight: "bold",
    fontSize: 16,
    width: "72%",
  },
  scrollViewContainer: {
    flex: 1,
    marginBottom: 45,
  },
  heading: {
    fontSize: 18,
    color: "#fff",
  },
  header: {
    backgroundColor: "#6b705c",
  },
  head: {
    color: "#ffe8d6",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "70%",
    height: "100%",
    backgroundColor: "#ddbea9",
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
  },
});
