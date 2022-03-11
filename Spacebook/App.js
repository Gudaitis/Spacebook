
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/home';
import MainScreen from './components/main';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';
// import LogoutScreen from './components/logout';

const Stack = createNativeStackNavigator();

function App (){
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />  
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Main" component={MainScreen}  options={{headerShown: false}} /> 

                </Stack.Navigator>
            </NavigationContainer>

        );
    }



export default App;
