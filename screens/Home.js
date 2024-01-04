import React from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Filters"
          onPress={() => navigation.navigate("Filters")}
        />
        <Button
          title="Go to Camera"
          onPress={() => navigation.navigate("Camera")}
        />
        <Button
          title="Go to User"
          onPress={() => navigation.navigate("User")}
        />
        <Button
          title="Go to Stats"
          onPress={() => navigation.navigate("StatEat")}
        />
        <Button
          title="Go to Test"
          onPress={() => navigation.navigate("ButtonList")}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
export default HomeScreen;
