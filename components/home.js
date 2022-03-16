/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {View, Image, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, { Text } from './styles';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      UID: [],
      isLoading: true,
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
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);

        this.setState({
          photo: data,
          isLoading: false,
        });
        this.photoToAsync();
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  photoToAsync = async () => {
    await AsyncStorage.setItem('@photo', this.state.photo);
  };

  getCurrentUser = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          info: responseJson,
        });
      })
      .then(async () => {
        await AsyncStorage.setItem('@first_name', this.state.info.first_name);
        await AsyncStorage.setItem('@last_name', this.state.info.last_name);
        await AsyncStorage.setItem('@email', this.state.info.email);
        await AsyncStorage.setItem('@friend_count', this.state.info.friend_count);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getFriends = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/friends`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  errorHandle(status) {
    if (status === 400) {
      throw 'Bad Request';
    } if (status === 401) {
      throw 'Unauthorised';
    } if (status === 403) {
      throw 'Forbidden';
    } if (status === 404) {
      throw 'Not Found';
    } if (status === 500) {
      throw 'Server Error';
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0E1428',
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    }
    return (

      <View style={styles.page}>
        <View style={styles.user}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={styles.photo}
          />
          <Text>
            {this.state.info.first_name}
            {' '}
            {this.state.info.last_name}
          </Text>

          <Text>
            {this.state.info.friend_count}
            {' '}
            Friends
          </Text>
        </View>

        {/* Nav */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Home'); }}>
            <Text> Home </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Friends'); }}>
            <Text> Friends </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Profile'); }}>
            <Text> Profile </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Logout'); }}>
            <Text> Logout </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postarea}>
          <Text styles={styles.title}>Welcome to Spacebook </Text>
        </View>
        <View style={styles.bottom} />
      </View>
    );
  }
}
export default HomePage;
