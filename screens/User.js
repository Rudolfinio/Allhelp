import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from '@rneui/themed';
import { ListItem } from '@rneui/themed';


const UserScreen = ({ navigation }) => {


    const checkIfExist = async()=>{
        if(await AsyncStorage.getItem('allergens') ==null){
            const allergen = {
                Gluten: { english: 'Gluten', polish: 'Gluten', value: false },
                Shellfish: { english: 'Shellfish', polish: 'Skorupiaki', value: false },
                Eggs: { english: 'Eggs', polish: 'Jajka', value: false },
                Fish: { english: 'Fish', polish: 'Ryby', value: false },
                Peanuts: { english: 'Peanuts', polish: 'Orzeszki ziemne', value: false },
                Soy: { english: 'Soy', polish: 'Soja', value: false },
                Milk: { english: 'Milk', polish: 'Mleko', value: false },
                Sesame: { english: 'Sesame', polish: 'Sezam', value: false },
                Tree_Nuts: { english: 'Tree Nuts', polish: 'Orzechy drzewne', value: false },
                Celery: { english: 'Celery', polish: 'Seler', value: false },
                Sulfites: { english: 'Sulfites', polish: 'Siarczyny', value: false },
                Lupin: { english: 'Lupin', polish: 'Łubin', value: false },
                Mollusks: { english: 'Mollusks', polish: 'Mięczaki', value: false }
              };
            storeData(allergen);
            console.log("PUSTA");
        }else{
            console.log("cos jest");
        }
    }
    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          console.log(value);
          await AsyncStorage.setItem('allergens', jsonValue);
        } catch (e) {
          // saving error
        }
      };
      const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('allergens');
          console.log("aa"+jsonValue);
          return jsonValue != null ? jsonValue : null;
        } catch (e) {
          // error reading value
        }
      };

      useEffect(()=>{
        const getDataKeys = async () => {
            try {
              const jsonValue = await AsyncStorage.getItem('allergens');
              const jsparse = JSON.parse(jsonValue);
              const keyArray = [];
              for(var i in jsparse){
                var key = i;
                // console.log(key);
                keyArray.push(<View key={key}>
                    <ListItem bottomDivider>
                    <ListItem.CheckBox
                      // Use ThemeProvider to change the defaults of the checkbox
                      iconType="material-community"
                      checkedIcon="checkbox-marked"
                      uncheckedIcon="checkbox-blank-outline"
                      checked={checked[0]}
                      onPress={() => setChecked([!checked[0], checked[1]])}
                    />
                    <ListItem.Content>
                    <ListItem.Title>{`${key}`}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                  </View>);
            }
    
            
              return keyArray != null ? keyArray : null;
              //   return jsonValue != null ? jsonValue : null;
            } catch (e) {
              // error reading value
            }
          };
          getDataKeys();
      },[]);
      
      const editData = async (what) => {
        try {
          const jsonValue = await AsyncStorage.getItem('allergens');
          const ajsonValue = JSON.parse(jsonValue);
          console.log(ajsonValue[what]);
          ajsonValue[what].value=true;
          console.log(ajsonValue[what]); 
          const jsonValueS = JSON.stringify(ajsonValue);
          await AsyncStorage.setItem('allergens', jsonValueS);
          return ajsonValue != null ? JSON.parse(ajsonValue) : null;
        } catch (e) {
          // error reading value
        }
      };
      const clearData = async () => {
        try {        
        await AsyncStorage.clear();        
        } catch (e) {        
        console.error(e);        
        }
    }
    const [checked, setChecked] = React.useState([false, false]);
    const keys = getDataKeys();
  return (
    <View>
      <Text>User Screen</Text>
      <Button
        title="Set"
        onPress={() => storeData(person)}
      />            
            <Button
        title="Edit"
        onPress={() => editData("Eggs")}
      />           
     <Button
        title="Get"
        onPress={() => getData()}
      />
 <Button
        title="Clear"
        onPress={() => clearData()}
      />
       <Button
        title="check"
        onPress={() => checkIfExist()}
      />      
      <Button
        title="Go back to Home"
        onPress={() => navigation.navigate('Home')}
      />
{/* {getDataKeys()} */}
            {/* <ListItem bottomDivider>
           <ListItem.CheckBox
             // Use ThemeProvider to change the defaults of the checkbox
             iconType="material-community"
             checkedIcon="checkbox-marked"
             uncheckedIcon="checkbox-blank-outline"
             checked={checked[0]}
             onPress={() => setChecked([!checked[0], checked[1]])}
           />
           <ListItem.Content>
           <ListItem.Title>aaa</ListItem.Title>
           </ListItem.Content>
         </ListItem>
         <ListItem bottomDivider>
           <ListItem.CheckBox
             // Use ThemeProvider to change the defaults of the checkbox
             iconType="material-community"
             checkedIcon="checkbox-marked"
             uncheckedIcon="checkbox-blank-outline"
             checked={checked[1]}
             onPress={() => setChecked([checked[0], !checked[1]])}
           />
           <ListItem.Content>
             <ListItem.Title>User 2</ListItem.Title>
           </ListItem.Content>
         </ListItem> */}
    </View>
  );
};

export default UserScreen;





