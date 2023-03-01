import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {api, api2, api3} from '../constants';
import {useDispatch, useSelector} from 'react-redux';
import {getfaceid} from '../redux/actions';
import {useIsFocused} from '@react-navigation/native';

export default function Database({navigation}) {
  const {getfaceid} = useSelector(state => state.faceidReducer);
  const {facelist} = useSelector(state => state.faceidReducer);
  const dispatch = useDispatch();
  const [list, setList] = useState('');
  const isFocused = useIsFocused();
  // function to refresh the screen
  useEffect(() => {
    if (isFocused) {
      fetch(api3).then(response =>
        response.json().then(data => {
          console.log(data);
          var result;
          result = data.split(',');
          var emp = [];
          result.forEach(element => {
            var i = {
              ID: element,
            };
            emp.push(i);
          });
          setList(emp);
          console.log('result', emp);
        }),
      );
    }
  }, [isFocused]);

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Database</Text>
      <FlatList
        data={list}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate('DatabaseScreen', {ID: item});
            }}>
            <View style={styles.body_view}>
              <Text style={styles.text}>{item.ID}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
/*
  useEffect(() => {
    fetch(api3).then(response =>
      response.json().then(data => {
        console.log(data);
        var result;
        result = data.split(',');
        var emp = [];
        result.forEach(element => {
          var i = {
            ID: element,
          };
          emp.push(i);
        });
        setList(emp);
        console.log('result', emp);
      }),
    );
  }, []);
  
  
  return (
    <View style={styles.body}>
      <Text style={styles.title}>Database</Text>
      <FlatList
        data={list}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <View style={styles.body_view}>
              <Text style={styles.text}>{item.ID}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
*/
const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000',
  },
  body_view: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#144357',
  },
  text: {
    color: '#aba669',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
    // backgroundColor: '#144357',
    margin: 10,
  },
  title: {
    color: '#aba669',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
    // backgroundColor: '#144357',
    margin: 10,
  },
  item: {
    marginHorizontal: 10,
    marginVertical: 7,
    paddingHorizontal: 50,
    backgroundColor: '#144357',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
  },
});
