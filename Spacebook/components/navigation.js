
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostsScreen from './posts';
import FriendScreen from './friends';
// import LogoutScreen from './components/logout';

const Stack = createNativeStackNavigator();

function Navigation (){
        return (
                <Stack.Navigator>
                    <Stack.Screen name="Friends" component={FriendScreen} options={{headerShown: false}} />
                    <Stack.Screen name="Posts" component={PostsScreen} />
                </Stack.Navigator>

        );
    }



export default Navigation;