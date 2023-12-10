import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { StyleSheet } from 'react-native';

const Product = ({ route, navigation }) => {
  const [productName, setproductName] = useState(null);
  const [productImage, setproductImage] = useState(null);
  const [productIngredients, setproductIngredients] = useState([]);
  const [productAllergens, setproductAllergens] = useState([]);
  const [productTraces, setproductTraces] = useState([]);
  const [error, setError] = useState(null);
  const { code } = route.params;
  const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${code['text']}?fields=product_name,selected_images,ingredients,allergens_hierarchy,allergens_from_ingredients`;
  const[readed, setReaded] = useState(false);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Błąd sieci: ${response.status}`);
      }

      const data = await response.json();
      setproductName(data['product']['product_name']);
      data['product']['selected_images']['front']['display']['pl']?setproductImage(data['product']['selected_images']['front']['display']['pl']):setproductImage(data['product']['selected_images']['front']['display']['en']);
      setproductAllergens(data['product']['allergens_hierarchy']);
      setproductIngredients(data['product']['ingredients']);
      setproductTraces(data['product']['traces'])
    } catch (error) { 
      setError(`Wystąpił błąd: ${error.message}`);
    }
  };
  if(readed===false){
    setReaded(true);
    fetchData(apiUrl);
  }
  // Funkcja, którą przekazujemy jako prop do BarCodeScanner
  const handleBarCodeRead = (barcodeData) => {
    // Możesz tutaj dodać dodatkową logikę lub odświeżyć dane na podstawie kodu kreskowego
    console.log(`Odczytano kod kreskowy: ${barcodeData}`);
    fetchData(apiUrl);
  };

  return (
    <View style={styles.container}>
        {productImage? (<Image
        style={styles.image}
        source={{uri:productImage}}
        contentFit="cover"
        transition={1000}
      />) : (<Text>There is no polish or english image for this product</Text>)}

        <Text>Name: {productName}</Text>       
        <Text>Ingredients: {productIngredients?(productIngredients.map((item) => item.text).join(', ')):("N/A")}</Text>
        <Text>Allergens: {productAllergens.length?(productAllergens.map((item) => item.replace('en:', '')).join(', ')):("N/A")}</Text>
        <Text>Traces: {productTraces? (productTraces.map((item) => item.text).join(', ')):("N/A")}</Text>
    </View>
    
  );
};

export default Product;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      //justifyContent: 'center',
    },
    image: {
        // flex: 1,
        width: 300,
        height: 250,
        resizeMode: 'contain',
        justifyContent: 'center',
    },
  });