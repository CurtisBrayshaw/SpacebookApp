import React, { Component } from 'react';
import { ScrollView, TextInput, Button, View, FlatList,Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Camera} from 'expo-camera';

class ProfilePage extends Component{
  constructor(props){
      super(props);

      this.state = {
          data:[],
          info: {},
          hasPermission: null,
          type: Camera.Constants.Type.back,
      }
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'denied'})
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getCurrentUser();
  };

  componentWillUnmount() {
  
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  cameraToggle = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'})
  }

  showfriends = async () => {
      const UID = await AsyncStorage.getItem('@UID');
      const sessionToken = await AsyncStorage.getItem('@session_token');
      //Validation here...

      return fetch("http://10.0.2.2:3333/api/1.0.0/user/6", {
          'headers': {
            'X-Authorization':  sessionToken
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            data: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getCurrentUser = async() => {
    console.log("Getting profile...");
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': session_token
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            //isLoading: false,
            info: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }


  checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      if (value == null) {
          this.props.navigation.navigate('Login');
      }
    };

render(){
  if(this.state.hasPermission){
return(
  <View style={styles.button}>
          <Camera style={styles.button} type={this.state.type}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  let type = type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back;

                  this.setState({type: type});
                }}>
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }else{
      return(
  <View>
  <Text>Name:{this.state.info.first_name} {this.state.info.last_name}</Text>
  <Text>Email Address: {this.state.info.email}</Text>
  <Button title="Take Picture" color="green" onPress={() => this.cameraToggle()} />
  </View>
      );
    }
  }
}

export default ProfilePage;

const styles = StyleSheet.create({

  button: {
    flex: 1,
    backgroundColor:('lightblue'),
    padding: 10,
  },


})