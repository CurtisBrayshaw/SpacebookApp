import React, { Component } from 'react';
import {
  ScrollView, TextInput, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  login = async () => fetch('http://10.0.2.2:3333/api/1.0.0/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(this.state),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 400) {
        throw 'Invalid email or password';
      } else {
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
      await AsyncStorage.setItem('@session_token', responseJson.token);
      await AsyncStorage.setItem('@UID', responseJson.id.toString());
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
      console.log(error);
    });

  saveInfo = async () => {
    await AsyncStorage.setItem('@email', email);
  };

  render() {
    return (
      <ScrollView>
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button
          title="Login"
          color="black"
          onPress={() => this.login()}
        />
        <Button
          title="Don't have an account?"
          color="green"
          onPress={() => {
            this.props.navigation.navigate('Signup');
            this.saveInfo(email);
          }}
        />
      </ScrollView>
    );
  }
}

export default LoginPage;
