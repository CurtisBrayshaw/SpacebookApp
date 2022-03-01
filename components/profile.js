import React, { Component } from 'react';
import { ScrollView, TextInput, Button, View, FlatList,Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfilePage extends Component{
  constructor(props){
      super(props);

      this.state = {
          data:[],
          info: {}
      }
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
  };

  componentWillUnmount() {
    this.unsubscribe();
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

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
      return (
        <View>
          
        <Text>Name:{this.state.info.first_name} {this.state.info.last_name}</Text>
        <Text>Email Address: {this.state.info.email}</Text>
        </View>
      )
    } 
}
export default ProfilePage;