import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "@rneui/themed";

const HomeScreen = ({ route, navigation }) => {
  const [productData, setProductData] = useState([]);
  const [lastSearch, setLastSearch] = useState([]);
  const { refresh } = route.params || {};

  const fetchFav = async () => {
    try {
      const existingData = await AsyncStorage.getItem("fav");
      const parsedData = existingData ? JSON.parse(existingData) : {};
      setProductData(parsedData);
      if (parsedData.fav != null) {
        setProductData(parsedData.fav);
      }
      const existingData2 = await AsyncStorage.getItem("history");
      const parsedData2 = existingData2 ? JSON.parse(existingData2) : {};
      setLastSearch(parsedData2);
      if (parsedData2.his != null) {
        setLastSearch(parsedData2.his);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchFav();
      if (refresh) {
        console.log("Home screen refreshed");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, refresh]);
  useEffect(() => {
    fetchFav();
  }, []);

  const handleItemPress = (code) => {
    navigateToProduct(code);
  };

  const navigateToProduct = (code) => {
    navigation.navigate("Product", { code, fromFilterScreen: false });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          backgroundColor="#F5F5F5"
          centerComponent={{ text: "Home", style: styles.head }}
        />
        <ScrollView>
          <View style={styles.scrollViewContainer}>
            <Text style={styles.sections}>Favourites</Text>

            {productData &&
              Object.keys(productData).map((code) => {
                const product = productData[code];
                return (
                  <TouchableOpacity
                    key={code}
                    onPress={() => handleItemPress(code)}
                    style={styles.itemContainer}
                  >
                    <Image
                      style={styles.image}
                      source={{
                        uri: product.productImageSmall,
                      }}
                      defaultSource={{ uri: "N/A" }}
                    />
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={2}
                      style={styles.listText}
                    >
                      {product.productName ? product.productName : "N/A"}
                    </Text>
                  </TouchableOpacity>
                );
              })}

            {Object.keys(productData).length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  color: "#212529",
                  fontWeight: "800",
                  fontSize: 15,
                }}
              >
                Add your first product to favourites!
              </Text>
            )}
            <Text style={styles.sections}>History</Text>
            {lastSearch &&
              Object.keys(lastSearch)
                .filter((code) => code !== "counter")
                .reverse()
                .map((code) => {
                  const product = lastSearch[code];
                  return (
                    <TouchableOpacity
                      key={code}
                      onPress={() => handleItemPress(code)}
                      style={styles.itemContainer}
                    >
                      <Image
                        style={styles.image}
                        source={{
                          uri: product.productImageSmall,
                        }}
                        defaultSource={{ uri: "N/A" }}
                      />
                      <Text
                        style={styles.listText}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                      >
                        {product.productName ? product.productName : "N/A"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            {Object.keys(lastSearch).length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  color: "#212529",
                  fontWeight: "800",
                  fontSize: 15,
                }}
              >
                Your search history will be here!
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.bottomButtonL}
            onPress={() => navigation.navigate("Filters")}
          >
            <Text style={styles.buttonText}>Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.navigate("Camera")}
          >
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.navigate("User")}
          >
            <Text style={styles.buttonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButtonR}
            onPress={() => navigation.navigate("StatEat")}
          >
            <Text style={styles.buttonText}>Stats</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  itemContainer: {
    height: 100,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
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
    width: "60%",
  },
  head: {
    color: "#292828",
    fontWeight: "bold",
    fontSize: 20,
  },
  sections: {
    marginTop: 10,
    color: "#292828",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 19,
    marginBottom: 10,
  },
  scrollViewContainer: {
    flex: 1,
    marginBottom: 60,
  },
  image: {
    width: 100,
    height: 90,
    resizeMode: "contain",
    justifyContent: "center",
    marginRight: 10,
    overflow: "hidden",
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
  },
  bottomButtonL: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderWidth: 0,
    borderColor: "transparent",
    borderTopLeftRadius: 15,
  },
  bottomButtonR: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderWidth: 0,
    borderColor: "transparent",
    borderTopRightRadius: 15,
  },
  buttonText: {
    color: "#292828",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;
