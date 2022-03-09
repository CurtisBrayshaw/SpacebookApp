/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-throw-literal */
import React, { Component } from 'react';
import {
  ScrollView, TextInput, Button, StyleSheet, View, Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StyledButton from './styles.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
    };
  }

  login = async () => fetch('http://192.168.0.48:3333/api/1.0.0/login', {
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

    <View style={styles.screen}> 
      <View style={styles.topper}>
      </View>
      <View style={styles.box}></View>
      <Text style={styles.topper}> Spacebook </Text>
                    <ScrollView>
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
                      <Button style = {styles.button}
                        title="Login"
                        onPress={() => this.login()}
                      />
                      <Button style = {styles.button}
                      title = "Button"
                      onPress={() => { this.props.navigation.navigate('Signup');}}
                      />
                    </ScrollView>
        <View style={styles.box}></View>
    </View>     
    
    );
  }
}

export default LoginPage;
const styles = StyleSheet.create({
  box: {
    flex: 2,
    padding: 5,
    margin: 5,
    backgroundColor: '#323873'
  },
  topper: {
    flex: 0.8,
    backgroundColor: '#4E5283',
    letterSpacing: 2,
    fontSize:40 
  },
  title:{
  backgroundColor: '#4E5283',
    letterSpacing: 2,
    fontSize:20
  },
  screen: {
    flex: 1,
    backgroundColor: '#323873'
  },
  input:{
    padding: 10,
    borderWidth: 1.5,
    margin: 5,
  },
})
