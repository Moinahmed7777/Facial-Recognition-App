import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';

const CustomButon = props => {
  return (
    <Pressable
      //onLongPress
      //delayLongPress={1000}
      onPress={props.onPressFunction}
      hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
      android_ripple={{color: '#aba66950'}}
      style={({pressed}) => [
        {backgroundColor: pressed ? '#31454E' : props.color},
        styles.button,
        {...props.style},
      ]}>
      <Text style={styles.text}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 45,
    // backgroundColor: '#FD7600',
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    // color: '#FD7600',
    color: '#aba669',
    fontSize: 18,
    fontStyle: 'normal',
    margin: 10,
    textAlign: 'center',
  },
});

export default CustomButon;
