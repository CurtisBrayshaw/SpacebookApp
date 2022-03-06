import React, { Component } from 'react';
import {
  ScrollView, TextInput, Button, View, FlatList, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class FriendProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserPosts();
    this.getCurrentUser();
  }

  componentWillUnmount() {

  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.button}>
        <Text> Friends Profile </Text>
      </View>
    );
  }
}

export default FriendProfilePage;

const styles = StyleSheet.create({

  button: {
    flex: 1,
    backgroundColor: ('lightblue'),
    padding: 10,
  },
  editbutton: {
    backgroundColor: ('white'),
    padding: 10,
    alignItems: 'flex-end',
  },
  posts: {
    backgroundColor: ('lightblue'),
    margin: 5,
    padding: 0,
    alignItems: 'flex-start',
  },
});
