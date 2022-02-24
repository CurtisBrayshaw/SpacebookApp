import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from './components/home';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import LogoutPage from './components/logout';
import FriendPage from './components/friends';
const Stack = createNativeStackNavigator();

class App extends Component{
    render(){
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Logout">
                    <Stack.Screen name="Home" component={HomePage} />
                    <Stack.Screen name="Login" component={LoginPage} />
                    <Stack.Screen name="Signup" component={SignupPage} />
                    <Stack.Screen name="Logout" component={LogoutPage} />
                    <Stack.Screen name="Friends" component={FriendPage} />
                </Stack.Navigator>
                
            </NavigationContainer>
        );
    }
}

export default App;