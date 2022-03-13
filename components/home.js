/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Button, Image, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles"

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      picURL: null,
      UID: [],
    };
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    
    this.getCurrentUser();
    this.getProfilePhoto();
    this.getFriends();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getProfilePhoto = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UID + '/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': session_token,
      },
    })
    .then((res) => {
      return res.blob()
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      
      this.setState({
        photo: data,
        isLoading: false,
      });
    })
    .catch((err) => {
      console.log('error', err);
    });
};

  getCurrentUser = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${UID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          // isLoading: false,
          info: responseJson,
        });
      })
      .then(async (responseJson) => {
        await AsyncStorage.setItem('@first_name', this.state.info.first_name);
        await AsyncStorage.setItem('@last_name', this.state.info.last_name);
        await AsyncStorage.setItem('@email', this.state.info.email);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getFriends = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UID + '/friends', {
      method: 'GET',
      headers: {
        'X-Authorization': session_token,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // isLoading: false,
          friendsData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPosts = async (friendsData) => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + this.state.UID +  '/post' ,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          // isLoading: false,
          postsData: responseJson,
        });

      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
<View style={styles.page}>

        <View style={styles.box}>
        <Image
            source={{
              uri: this.state.photo,
            }}
            style={{width: 100, height: 100, backgroundColor: "grey",}}
        />
          <Text>{this.state.info.first_name} {this.state.info.last_name} </Text>
          
          <Text>{this.state.info.friend_count} Friend(s)</Text>
          

        </View>

        <View style={styles.button}>
          <Button
            title="Friends"
            onPress={() => this.props.navigation.navigate('Friends')}
          />
          <Button
            title="Profile"
            onPress={() => this.props.navigation.navigate('Profile')}
          />
          <Button
            title="Logout"
            onPress={() => this.props.navigation.navigate('Logout')}
          />
        </View>
        
</View>


    );
  }
}

export default HomePage;
