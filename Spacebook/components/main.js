
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './home';
import SearchScreen from './search';
import FriendRequestScreen from './friendrequests';
import UserProfileScreen from './userprofile';
import CameraScreen from './camera';
import SinglePostScreen from './singlepost';
import FriendScreen from './friends';
import PostsScreen from './posts';


const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const FriendStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const mainStack = () => {
  return(
   <HomeStack.Navigator >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Single Post" component={SinglePostScreen}/>
   </HomeStack.Navigator>
)
}
const secondStack = () => {
  return(
   <FriendStack.Navigator>
    <FriendStack.Screen name="Friends" component={FriendScreen} />
    <FriendStack.Screen name="Posts" component={PostsScreen}/>
   </FriendStack.Navigator>
)
}
const thirdStack = () => {
  return(
   <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={UserProfileScreen} />
    <ProfileStack.Screen name="Camera" component={CameraScreen}/>
   </ProfileStack.Navigator>
)
}

class MainScreen extends Component {

render() {
  return (

    <Tab.Navigator>
      <Tab.Screen name="Home" component={mainStack} options={{headerShown: false}} />
      <Tab.Screen name="Search" component={SearchScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Friends" component={secondStack} options={{headerShown: false}} />
      <Tab.Screen name="Friend Requests" component={FriendRequestScreen} options={{headerShown: false}} />
      <Tab.Screen name="Profile" component={thirdStack} options={{headerShown: false}} />
    </Tab.Navigator>


  );
}

}


export default MainScreen;
