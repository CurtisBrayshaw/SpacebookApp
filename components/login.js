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
      isLoading: true,
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
      } else {this.errorHandle(response.status)}
    })
    .then(async (responseJson) => {
      console.log(responseJson);
      await AsyncStorage.setItem('@session_token', responseJson.token);
      await AsyncStorage.setItem('@UID', responseJson.id.toString());
      await AsyncStorage.setItem('@password', this.state.password);
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
    });
    
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
     }
    }
  render() {
    return (

    <View style={styles.page}> 
      <View style={styles.topper}></View>
      <Text style={styles.spacebook}>      Spacebook </Text>

                    <ScrollView style={styles.info}>
                      <TextInput
                        placeholder="Enter your email..."
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        style={styles.input}
                      />
                      <TextInput
                        placeholder="Enter your password..."
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        secureTextEntry
                        style={styles.input}
                      />
                  
                      <Button
                        title="Login"
                        onPress={() => this.login()}
                        color={'#F0A202'}
                      />
                      <Button
                      title = "Don't have an account?"
                      color={'#0E1428'}
                      onPress={() => { this.props.navigation.navigate('Signup');}}
                      />
                  </ScrollView> 
    </View>     
    
    );
  }
}

export default LoginPage;