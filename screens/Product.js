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
  Button,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "@rneui/themed";

const Product = ({ route, navigation }) => {
  const [productName, setproductName] = useState(null);
  const [productImage, setproductImage] = useState(null);
  const [productImageSmall, setproductImageSmall] = useState(null);
  const [productIngredients, setproductIngredients] = useState([]);
  const [productAllergens, setproductAllergens] = useState([]);
  const [productTraces, setproductTraces] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${
    route.params?.code?.text ? route.params?.code.text : route.params?.code
  }?fields=code,product_name,selected_images,ingredients,allergens_hierarchy,allergens_from_ingredients,traces`;
  const [readed, setReaded] = useState(false);
  const [allergeny, setAllergeny] = useState([]);
  const [Code, setCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [favor, setFavor] = useState(false);
  const { fromFilterScreen } = route.params.fromFilterScreen;
  useEffect(() => {

    const fetchDataAll = async () => {
      try {
        const storedAllergens = await AsyncStorage.getItem("allergens2");
        const existingData = await AsyncStorage.getItem("fav");
        const parsedData = existingData ? JSON.parse(existingData) : {};
        if (parsedData.fav != null) {
          if (parsedData?.fav[route.params?.code]) {
            setChecked(true);
          }
        }
        if (storedAllergens) {
          setAllergeny(JSON.parse(storedAllergens));
        }
      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    };

    fetchDataAll();
    setReaded(true);
    fetchData(apiUrl);
  }, [route.params?.code]);

  useEffect(() => {
    const fetchHistory = async () => {
      //await AsyncStorage.removeItem("history");
      if (productName != null && productImageSmall != null && Code != null) {
        try {
          const storedHistory = await AsyncStorage.getItem("history");
          const parsedData = storedHistory ? JSON.parse(storedHistory) : {};

          const newData = {
            his: {
              ...parsedData.his,
              [Code]: {
                ...(parsedData.his && parsedData.his[Code]
                  ? parsedData.his[Code]
                  : {}),
                productName: productName,
                productImageSmall: productImageSmall,
              },
            },
          };

          await AsyncStorage.setItem("history", JSON.stringify(newData));
        } catch (error) {
          console.error("Error accessing AsyncStorage:", error);
        }
      }
    };
    fetchHistory();
  }, [productName, productImageSmall, Code]);

  useEffect(() => {
    if (fromFilterScreen) {
      navigation.navigate("Home", { refresh: true });
    }
  }, [navigation, fromFilterScreen]);

  useEffect(() => {
    if (readed) {
      catchAll();
    }
  }, [productTraces]);
  const catchAll = () => {
    compareObjects(allergeny, productAllergens, productTraces);
  };
  const compareObjects = (allergens, prAllergens, prTraces) => {
    for (const key of prAllergens) {
      const keyN = key.replace("en:", "");
      const firstLetter = keyN.charAt(0);
      const firstLetterCap = firstLetter.toUpperCase();
      const remainingLetters = keyN.slice(1);
      const capitalizedWord = firstLetterCap + remainingLetters;

      if (allergens[capitalizedWord] && allergens[capitalizedWord].value) {
        setModalVisible(true);
        return;
      }
    }

    for (const key of prTraces) {
      const keyN = key.replace("en:", "");
      const firstLetter = keyN.charAt(0);
      const firstLetterCap = firstLetter.toUpperCase();
      const remainingLetters = keyN.slice(1);
      const capitalizedWord = firstLetterCap + remainingLetters;

      if (allergens[capitalizedWord] && allergens[capitalizedWord].value) {
        setModalVisible(true);
        return;
      }
    }
  };

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Błąd sieci: ${response.status}`);
      }

      const data = await response.json();
      setproductName(data["product"]["product_name"]);
      setCode(data["product"]["code"]);
      data["product"]["selected_images"]["front"]["display"]["pl"]
        ? setproductImage(
            data["product"]["selected_images"]["front"]["display"]["pl"]
          )
        : setproductImage(
            data["product"]["selected_images"]["front"]["display"]["en"]
          );
      setproductImageSmall(
        data.product.selected_images?.front?.small[
          Object.keys(data.product.selected_images.front.small)[0]
        ]
      );
      setproductAllergens(data["product"]["allergens_hierarchy"]);
      setproductIngredients(data["product"]["ingredients"]);
      setproductTraces(
        data["product"]["traces"]
          .replace(/en:/g, "")
          .replace(/[^\w\s,]/gi, "")
          .replace(/,/g, ", ")
          .split(", ")
      );
    } catch (error) {
      setError(`Wystąpił błąd: ${error.message}`);
    }
  };
  const toggleCheckbox = async () => {
    setChecked(!checked);
    setFavor(!favor);
    if (checked === false) {
      try {
        const existingData = await AsyncStorage.getItem("fav");
        const parsedData = existingData ? JSON.parse(existingData) : {};
        const newData = {
          fav: {
            ...parsedData.fav,
            [Code]: {
              ...(parsedData.fav && parsedData.fav[Code]
                ? parsedData.fav[Code]
                : {}),
              productName: productName,
              productImageSmall: productImageSmall,
            },
          },
        };

        await AsyncStorage.setItem("fav", JSON.stringify(newData));
      } catch (error) {
        console.error("Error adding data:", error);
      }
    } else {
      try {
        const existingData = await AsyncStorage.getItem("fav");
        const dd = JSON.parse(existingData);

        delete dd.fav[Code];
        await AsyncStorage.setItem("fav", JSON.stringify(dd));
      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {productImage ? (
        <Image
          style={styles.image}
          source={{ uri: productImage }}
          contentFit="cover"
          transition={1000}
        />
      ) : (
        <Text>There is no polish or english image for this product</Text>
      )}
      <Text>Name: {productName ? productName : "N/A"}</Text>
      <Text>
        Ingredients:{" "}
        {productIngredients
          ? productIngredients.map((item) => item.text).join(", ")
          : "N/A"}
      </Text>
      <Text>
        Allergens:{" "}
        {productAllergens.length
          ? productAllergens.map((item) => item.replace("en:", "")).join(", ")
          : "N/A"}
      </Text>
      <Text>
        Traces:{" "}
        {productTraces != ""
          ? productTraces.map((item) => item.replace("en:", "")).join(", ")
          : "N/A"}
      </Text>
      <Button
        title="Go to Eat"
        onPress={() =>
          navigation.navigate("Eat", { Code, productName, productImageSmall })
        }
      />
      <CheckBox
        checked={checked}
        checkedIcon="heart"
        uncheckedIcon="heart-o"
        checkedColor="red"
        onPress={toggleCheckbox}
      />
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
            <Text style={styles.modalText}>Waring!</Text>
            <Text style={styles.modalText}>Detected one or more allergens</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Product;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  image: {
    // flex: 1,
    width: 300,
    height: 250,
    resizeMode: "contain",
    justifyContent: "center",
    marginTop: 42,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
