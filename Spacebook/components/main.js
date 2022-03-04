
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './home';
import FriendScreen from './friends';
import LogoutScreen from './logout';
import SearchScreen from './search';
import FriendRequestScreen from './friendrequests';


const Tab = createBottomTabNavigator();

class MainScreen extends Component {


render() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Friends" component={FriendScreen} />
      <Tab.Screen name="Friend Requests" component={FriendRequestScreen} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}
}


export default MainScreen;
