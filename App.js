// App.js

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import FiltersScreen from "./screens/Filters";
import BCScanner from "./screens/BarCodeScanner";
import Product from "./screens/Product";
import UserScreen from "./screens/User";
import MyComponent from "./screens/User2";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Filters" component={FiltersScreen} />
        <Stack.Screen name="Camera" component={BCScanner} />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{ title: "Product's details:" }}
        />
        {/* <Stack.Screen name="User" component={UserScreen} /> */}
        <Stack.Screen name="User" component={MyComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
