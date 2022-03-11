
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostsScreen from './posts';
import FriendScreen from './friends';
import LogoutScreen from './logout';

const Stack = createNativeStackNavigator();

function Navigation (){
        return (
                <Stack.Navigator>
                    <Stack.Screen name="Friends" component={FriendScreen} />
                    <Stack.Screen name="Posts" component={PostsScreen} />
                    <Stack.Screen name="Logout" component={LogoutScreen} />
                </Stack.Navigator>

        );
    }



export default Navigation;