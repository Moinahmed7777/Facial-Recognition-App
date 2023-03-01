//Database Delete Screen
import {StyleSheet, Text, View} from 'react-native';

import React, {useState, useEffect} from 'react';
import {api4} from '../constants';
import CustomButon from '../utils/CustomButton';
export default function DatabaseScreen({navigation, route}) {
  const name = route.params.ID;
  const [response, setResponse] = useState(null);
  console.log('index_img in display', name);

  const handleDelete = () => {
    console.log(name.ID);
    fetch(api4 + name.ID, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          console.log('Item deleted successfully');
        } else {
          console.error('Error deleting item');
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.body}>
      <CustomButon
        title="DELETE"
        color="#144357"
        onPressFunction={() => {
          handleDelete();
          navigation.goBack();
        }}
      />
      {response && <Text>{JSON.stringify(response)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 100,
    backgroundColor: '#000',
  },
  text: {
    color: '#aba669',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
    margin: 10,
  },
});

//#31454E #fd7600 #3E1558 #aba669
