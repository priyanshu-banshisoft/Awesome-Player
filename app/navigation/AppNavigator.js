import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import PlayListDetail from '../screens/PlayListDetail';
import { StatusBar } from 'expo-status-bar';
import color from '../misc/color';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='PlayList' component={PlayList} />
      <Stack.Screen name='PlayListDetail' component={PlayListDetail} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor:'#000'}}} >
      <Tab.Screen
        name='AudioList'
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='headset' size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}

      />
      <Tab.Screen
        name='Player'
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name='compact-disc' size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}
      />
      {/* <Tab.Screen
        name='PlayList'
        component={PlayListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='library-music' size={size} color={color} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default AppNavigator;
