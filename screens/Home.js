import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Filters"
        onPress={() => navigation.navigate('Filters')}
      /> 
      <Button
      title="Go to Camera"
      onPress={() => navigation.navigate('Camera')}
    />
    {/* <Button
    title="Go to User"
    onPress={() => navigation.navigate('User')}
  />   */}
  <Button
  title="Go to User"
  onPress={() => navigation.navigate('User')}
/>
    </View>
  );
};

export default HomeScreen;