/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  StyleSheet, View, Button, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, { Text } from './styles';

class EditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      email: null,
      hasPermission: null,
      first_name: null,
      last_name: null,
      email: null,
      password: null,
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.notNull();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  sendToServer = async (data) => {
    console.log('Sent to server..');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    const res = data.base64;
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': session_token,
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200 || 201) {
          console.log('Picture added', response);
        } else {this.errorHandle(response.status)}
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateProfile = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');

    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },

      body: JSON.stringify(
        {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          password: this.state.password,
        },
      ),
    })
      .then((response) => {
        if (response.status === 200 || 201) {
          console.log('Updated Profile')
        } else {this.errorHandle(response.status)}
      })
      .then((responseJson) => {
        this.setState({
          allinfo: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  notNull = async () => {
    this.setState({ first_name: await AsyncStorage.getItem('@first_name') });
    console.log(this.state.first_name);

    this.setState({ last_name: await AsyncStorage.getItem('@last_name') });
    console.log(this.state.last_name);

    this.setState({ email: await AsyncStorage.getItem('@email') });
    console.log(this.state.email);

    this.setState({ password: await AsyncStorage.getItem('@password') });
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
      <View style={styles.page}>
        <View>
          <Button title="Take Picture" onPress={() => this.props.navigation.navigate('Camera')} />
          <Text>
            {this.state.info.first_name}
            {' '}
            {this.state.info.last_name}
          </Text>

        </View>
        <Text>Enter New First Name</Text>
        <TextInput
          placeholder="Enter First Name"
          onChangeText={(first_name) => this.setState({ first_name })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Surname</Text>
        <TextInput
          placeholder="Enter Last Name"
          onChangeText={(last_name) => this.setState({ last_name })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Email Address</Text>
        <TextInput
          placeholder="Enter New Email Address"
          onChangeText={(email) => this.setState({ email })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Password</Text>
        <TextInput
          placeholder="Enter New Password"
          onChangeText={(password) => this.setState({ password })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
          secureTextEntry
        />
        <Button title="Submit" onPress={() => this.updateProfile() & this.props.navigation.navigate('Home')} />
      </View>
    );
  }
}

export default EditPage;
