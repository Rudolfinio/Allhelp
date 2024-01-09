// App.js

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import FiltersScreen from "./screens/Filters";
import BCScanner from "./screens/BarCodeScanner";
import Product from "./screens/Product";
import User from "./screens/User";
import StatEat from "./screens/StatEat";
import Eat from "./screens/Eat";
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Filters"
          component={FiltersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={BCScanner}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="User"
          component={User}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StatEat"
          component={StatEat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Eat"
          component={Eat}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
