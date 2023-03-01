import React, {useEffect} from 'react';

import {View, StyleSheet, Image, Text} from 'react-native';

import PushNotification from 'react-native-push-notification';

export default function Splash({navigation}) {
  useEffect(() => {
    // createTable();

    createChannels();
    setTimeout(() => {
      navigation.replace('My Tasks');
    }, 2000);
  }, []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'task-channel',
      channelName: 'Task Channel',
    });
  };

  return (
    <View style={styles.body}>
      <Image style={styles.logo} source={require('../../assets/2.jpg')}></Image>
      <Text style={styles.text}>Face ID</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  logo: {
    width: 100,
    // fontWeight: 'bold',
    height: 100,
    margin: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Entypo',
    color: '#144357',
    // color: '#31454E'
  },
});
