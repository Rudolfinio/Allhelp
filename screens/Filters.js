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
  const handleItemPress = (code) => {=
    navigateToProduct(code);
  };

  const navigateToProduct = (code) => {
    navigation.navigate("Product", { code, fromFilterScreen: true });
  };

  const handleEndReached = () => {
    if (page < pages) {
      setPage((prevPage) => prevPage + 1);
    }
    console.log("??");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          backgroundColor="#F5F5F5"
          rightComponent={{
            icon: "menu",
            color: "#292828",
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
              backgroundColor: "#F5F5F5",
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
                color: "#292828",
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
                            color: "#424141",
                            fontWeight: "700",
                            fontSize: 15,
                          }}
                        >
                          {allergeny[key].english}
                        </Text>
                        <CheckBox
                          checked={allergeny[key].value}
                          onPress={() => handleCheckboxChange(key)}
                          wrapperStyle={{ backgroundColor: "#ffffff" }}
                          containerStyle={{ backgroundColor: "#ffffff" }}
                          checkedColor="#0073e6"
                          uncheckedColor="#404f4f"
                        />
                        <CheckBox
                          checked={trace[key].value}
                          onPress={() => handleCheckboxChangeTraces(key)}
                          wrapperStyle={{ backgroundColor: "#ffffff" }}
                          containerStyle={{ backgroundColor: "#ffffff" }}
                          checkedColor="#0073e6"
                          uncheckedColor="#404f4f"
                        />
                      </View>
                    ))}
                  <Button
                    onPress={closeModal}
                    buttonStyle={{
                      backgroundColor: "#0073e6",
                      borderWidth: 0,
                      borderColor: "transparent",
                      borderRadius: 15,
                      width: 150,
                      height: 40,
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
    backgroundColor: "#ffffff",
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
  listText: {
    color: "#424141",
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
    color: "#292828",
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
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
  },
});
