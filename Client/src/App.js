import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider} from 'react-redux';
import {Store} from './redux/store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Mainscreen from './Screens/Mainscreen';
import Upload from './Screens/Upload';
import Display from './Screens/Display';
import Splash from './Screens/Splash';
import Camera from './Screens/Camera';
import Database from './Screens/Database';
import DatabaseScreen from './Screens/DatabaseScreen';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#000',
        },
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'Mainscreen') {
            iconName = 'canadian-maple-leaf';
            size = focused ? 25 : 20;
          } else if (route.name === 'Database') {
            iconName = 'address-book';
            size = focused ? 25 : 20;
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#aba669',
        inactiveTintColor: '#999',
        labelStyle: {fontSize: 15, fontWeight: 'bold'},
      }}>
      <Tab.Screen
        name={'Mainscreen'}
        component={Mainscreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={'Database'}
        component={Database}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const RootStack = createStackNavigator();

function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#144357',
              // width: 250,
            },
            headerShown: false,
            headerTintColor: '#aba669',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
            },
          }}>
          <RootStack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="My Tasks"
            component={HomeTabs}
            options={{
              headerShown: false,
            }}
          />

          <RootStack.Screen
            name="Upload"
            component={Upload}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Camera"
            component={Camera}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="DatabaseScreen"
            component={DatabaseScreen}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Display"
            component={Display}
            options={{
              headerShown: false,
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
