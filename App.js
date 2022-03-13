// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-native-gesture-handler';
import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// eslint-disable-next-line no-unused-vars
import { Camera } from 'expo-camera';
import HomePage from './components/home';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import LogoutPage from './components/logout';
import FriendPage from './components/friends';
import ProfilePage from './components/profile';
import EditPage from './components/edit';
import FriendProfilePage from './components/friendprofile';
import ViewPostPage from './components/singlepost';

const Stack = createNativeStackNavigator();

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Logout">
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
          <Stack.Screen name="Logout" component={LogoutPage} />
          <Stack.Screen name="Friends" component={FriendPage} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Edit Profile" component={EditPage} />
          <Stack.Screen name="Friend Profile" component={FriendProfilePage} />
          <Stack.Screen name="Single Post" component={ViewPostPage} />
        </Stack.Navigator>

      </NavigationContainer>
    );
  }
}
export default App;