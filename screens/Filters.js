import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FiltersScreen = ({ navigation }) => {
  const apiUrl = `https://world.openfoodfacts.org/api/v2/search?fields=selected_images,product_name,code,allergens_from_ingredients,traces,allergens_tags&sort_by=unique_scans_n&page_size=24`;
  const [productName, setProductName] = useState(null);
  const [productImage, setProductImage] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    fetchData(apiUrl);
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const data = await response.json();
      setProductData(data.products);
      // data["products"]["selected_images"]["front"]["thumb"]["pl"]
      //   ? setProductImage(
      //       data["products"]["selected_images"]["front"]["thumb"]["pl"]
      //     )
      //   : setProductImage(
      //       data["products"]["selected_images"]["front"]["thumb"]["en"]
      //     );
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Filters Screen</Text>
          {error ? (
            <Text>Error: {error}</Text>
          ) : (
            <View>
              {productData.map((product, index) => (
                <React.Fragment key={index}>
                  <View style={styles.itemContainer}>
                    <Image
                      style={styles.image}
                      source={{ uri: product.selected_images.front.small[Object.keys(product.selected_images.front.small)[0]] }}
                    ></Image>
                    <Text>
                      {product.product_name ? product.product_name : "N/A"}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          )}
          <Button
            title="Go back to Home"
            onPress={() => navigation.navigate("Home")}
          />
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
    //justifyContent: 'center',
  },
  image: {
    // flex: 1,
    width: 100,
    height: 100,
    resizeMode: "contain",
    justifyContent: "center",
    marginRight: 10,
  }, itemContainer: {
    backgroundColor: '#455561',
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Center children vertically
    marginBottom: 10, // Adjust this value as needed 
  },
});
