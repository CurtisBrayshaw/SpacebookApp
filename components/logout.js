import React, { Component } from 'react';
import {ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles, { Text } from './styles';
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  logout = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        this.setState({
        isLoading: false})
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };
  errorHandle(status){
    if (status === 400) {
     throw 'Bad Request';
   }if (status === 401) {
     throw 'Unauthorised';
   }if (status === 403) {
     throw 'Forbidden';
   }if (status === 404) {
     throw 'Not Found';
   }if (status === 500) {
     throw 'Server Error';
   }}
  render() {
    return (
      <ScrollView style={{backgroundColor:'#0E1428' }}>
        <Text style={styles.title}
        >
          Really?
        </Text>
        <Button
          title="Logout"
          onPress={() => this.logout()}
        />
        <Button
          title="Home"
          color="darkblue"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </ScrollView>
    );
  }
}

export default HomePage;
