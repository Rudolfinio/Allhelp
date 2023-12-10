import React from 'react';
import { View, Text, Button } from 'react-native';

const FiltersScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Filters Screen</Text>
      <Button
        title="Go back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default FiltersScreen;





