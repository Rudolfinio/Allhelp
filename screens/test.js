import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ButtonList = () => {
  const buttonsData = [
    { icon: 'angry', value: 1, color: 'red' },
    { icon: 'sad-tear', value: 2, color: 'orange' },
    { icon: 'meh', value: 3, color: '#FFD700' },
    { icon: 'smile', value: 4, color: 'lightgreen' },
    { icon: 'grin', value: 5, color: 'green' },
  ];

  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonPress = (index) => {
    console.log(`Selected value: ${buttonsData[index].value}`);
    setSelectedButton(index);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView horizontal contentContainerStyle={styles.container}>
        {buttonsData.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              { backgroundColor: button.color, opacity: selectedButton === null || selectedButton === index ? 1 : 0.5 },
            ]}
            onPress={() => handleButtonPress(index)}
          >
            <Icon name={button.icon} size={24} color="white" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default ButtonList;
