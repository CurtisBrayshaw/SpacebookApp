import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList,Image, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
class HomePage extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      listData: [],
      info: {},
      photo: URL
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

  getProfilePhoto = async () => {

    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch ('http://10.0.2.2:3333/api/1.0.0/user/' + UID + "/photo", {
      headers: {
          'X-Authorization': session_token
      }
    })
    .then ((res) => {
      return res.blob();
    })

    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({
        isLoading: false,
        photo: data
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
        this.getProfilePhoto();
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

  render() {
      return (
        <View>
          
          <View style={styles.box}>
          <Image style={styles.logo} source={{uri: this.state.photo}}/>
          <Text>{this.state.info.first_name} {this.state.info.last_name}</Text>
          </View>

          <Button style={styles.button}
                title="Logout"
                color="green"
                onPress={() => this.props.navigation.navigate("Logout")}
          />
          <Button style={styles.button}
                title="Friends"
                color="green"
                onPress={() => this.props.navigation.navigate("Friends")}
          />
          <Button style={styles.button}
                title="Profile"
                color="green"
                onPress={() => this.props.navigation.navigate("Profile")}               
          />
        </View>
      );
    }
    
  }
const styles = StyleSheet.create({
  box: {
  
    backgroundColor:('lightblue'),
    padding: 10,
    
  },
  button: {
  
    backgroundColor:('lightblue'),
    padding: 10,
    
  },
  logo: {
    width: 50,
    height: 50
  }
})



export default HomePage;