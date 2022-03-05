import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList,Image, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

class HomePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      listData: [],
      info: {},
      picURL: ''
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
        getProfilePhoto();
    })
    .then(async (responseJson) => {
      console.log(responseJson);
      await AsyncStorage.setItem('@first_name', responseJson.first_name);
      await AsyncStorage.setItem('@last_name', responseJson.last_name);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getProfilePhoto = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch ('http://10.0.2.2:3333/api/1.0.0/user/' + UID + "/photo", {
      headers: {
          method: 'get',
          headers:{
          'X-Authorization': session_token,
          'Content-Type': 'application/json'
          }
        }
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({picURL:data});
    })
    .catch((error) => {
        console.log(error);
    })
  }

  render() {
      return (
        <View style={styles.page}>

          <View style={styles.box}>
          {/* <Image style={styles.logo} source={this.state.picURL}/> */}
          <Text>Name: {this.state.info.first_name} {this.state.info.last_name} </Text>
          <Text>Friends:{this.state.info.friend_count} </Text>
          </View>
            
              <View style={styles.button}>
              <Button 
                  title="Friends"
                  onPress={() => this.props.navigation.navigate("Friends")}
              />
              <Button 
                  title="Profile"
                  onPress={() => this.props.navigation.navigate("Profile")}               
              />
              <Button 
                  title="Logout"
                  onPress={() => this.props.navigation.navigate("Logout")}
              />
            </View>
        </View>
      );
    }
    
  }
const styles = StyleSheet.create({
  box: {
    backgroundColor:('white'),
    padding: 10,
    
  },
  button: {
  flexWrap: 'wrap',
  alignContent: 'stretch',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  color: "green",
  width: 80,
  height: 300,
  flexDirection: 'row',
  },

  logo: {
    flex:1,
    width: 50,
    height: 50
  },

  page: {
    flex:1,
    padding:5,
    width: 500,
    height: 500,
    backgroundColor:('lightblue'),
  }
})



export default HomePage;