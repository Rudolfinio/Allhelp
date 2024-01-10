import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import { BarCodePoint, BarCodeScanner } from "expo-barcode-scanner";
import { Product, handleBarCodeRead } from "./Product";
import { Header, Button } from "@rneui/themed";

// const BCScanner = ({ navigation }) =>
export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor="#6b705c"
        centerComponent={{ text: "Camera", style: styles.head }}
      />
      <View style={styles.container}>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
        <Text style={styles.maintext}>{text}</Text>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {scanned && (
            <Button
              onPress={() => setScanned(false)}
              buttonStyle={{
                backgroundColor: "#cb997e",
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
                Scan again?
              </Text>
            </Button>
          )}
          {scanned && (
            <Button
              onPress={() =>
                navigation.navigate("Product", {
                  code: { text },
                  fromFilterScreen: false,
                })
              }
              buttonStyle={{
                backgroundColor: "#6b705c",
                borderWidth: 0,
                borderColor: "transparent",
                borderRadius: 15,
                width: 150,
                height: 40,
                marginLeft:20,
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
                Go to Product
              </Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe8d6",
    alignItems: "center",
    justifyContent: "center",
  },
  containerCam: {
    flex: 1,
    backgroundColor: "#ffe8d6",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    color: "#6b705c",
    fontWeight: "bold",
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
  head: {
    color: "#ffe8d6",
    fontWeight: "bold",
    fontSize: 20,
  },
});
