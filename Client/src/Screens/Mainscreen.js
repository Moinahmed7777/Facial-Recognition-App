//MainScreen
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {setFaceid} from '../redux/actions';
import RNFS from 'react-native-fs';

export default function Mainscreen({navigation}) {
  const {faceid} = useSelector(state => state.faceidReducer);
  const dispatch = useDispatch();

  return (
    <View style={styles.body}>
      <FlatList
        data={faceid}
        renderItem={({item}) => (
          <View style={styles.body}>
            <Text style={styles.body_text}>Prediction : {item.ID}</Text>
            <Image style={styles.image} source={{uri: item.Path}} />
          </View>
        )}
      />
      <View style={styles.column}>
        <TouchableOpacity
          style={styles.extra_button}
          onPress={() => {
            navigation.navigate('Camera', {Task: 1, Imageid: 0});
          }}>
          <View style={styles.row}>
            <Text style={styles.text}> Identify face </Text>
            <FontAwesome5 name={'question'} size={30} color="#aba669" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.extra_button}
          onPress={() => {
            navigation.navigate('Upload');
          }}>
          <View style={styles.row}>
            <Text style={styles.text}> Upload </Text>
            <FontAwesome5 name={'upload'} size={30} color="#aba669" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000',
  },
  text: {
    color: '#aba669',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
    // backgroundColor: '#144357',
    margin: 10,
  },
  body_text: {
    color: '#aba669',
    backgroundColor: '#000',
    margin: 10,
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
  },
  extra_button: {
    // flex: 1,
    height: 50,
    width: 200,
    backgroundColor: '#144357',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // top: 500,
  },
  column: {
    // flex: 1,
    flexDirection: 'column',
    height: 250,
  },
  row: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
  },
});
