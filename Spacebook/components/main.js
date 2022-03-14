
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './home';
// import FriendScreen from './friends';
import Navigation from './navigation';
import SearchScreen from './search';
import FriendRequestScreen from './friendrequests';
import UserProfileScreen from './userprofile';
import CameraScreen from './camera';


const Tab = createBottomTabNavigator();

class MainScreen extends Component {


render() {
  return (
    
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Friends" component={Navigation} options={{headerShown: false}} />
      <Tab.Screen name="Friend Requests" component={FriendRequestScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} options={{tabBarVisible: false}}/>
    </Tab.Navigator>
  );
}


}


export default MainScreen;
