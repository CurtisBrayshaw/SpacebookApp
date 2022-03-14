/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-throw-literal */
import React, { Component } from 'react';
import {
  ScrollView, TextInput, Button, StyleSheet, View, Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles"

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
    };
  }

  login = async () => fetch('http://localhost:3333/api/1.0.0/login', {
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
      console.log(responseJson);
      await AsyncStorage.setItem('@session_token', responseJson.token);
      await AsyncStorage.setItem('@UID', responseJson.id.toString());
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
      console.log(error);
    });

  setPassword = async () =>{
    await AsyncStorage.setItem('@password', this.state.password);
  }

  render() {
    return (

    <View style={styles.page}> 
      <View style={styles.topper}></View>
      <Text style={styles.title}>      Spacebook </Text>

                    <ScrollView style={styles.info}>
                      <TextInput
                        placeholder="Enter your email..."
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        style={styles.input}
                      />
                      <TextInput
                        placeholder="Enter your password..."
                        onChangeText={(password) => this.setState({ password }) & this.setPassword()}
                        value={this.state.password}
                        secureTextEntry
                        style={styles.input}
                      />
                  
                      <Button
                        title="Login"
                        onPress={() => this.login()}
                      />
                      <Button
                      title = "Don't have an account?"
                      backgroundColor
                      onPress={() => { this.props.navigation.navigate('Signup');}}
                      />
                  </ScrollView> 
    </View>     
    
    );
  }
}

export default LoginPage;

