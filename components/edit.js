import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList,Image, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditPage extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: false,
        listData: [],
        info: {},
        email: null,
      }
    }
    
    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
      };
    
      async componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
    
      };
      componentWillUnmount() {
        this.unsubscribe();
      };

render() {
    return (
      <View>
        
        <View style={styles.box}>
        <Image style={styles.logo} source={{uri: this.state.photo}}/>
        <Text>{this.state.info.first_name} {this.state.info.last_name}</Text>
        </View>
        <Text>Enter New First Name</Text>
        <TextInput
            placeholder="Enter First Name"
            value={this.state.firstName}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <Text>Enter New Surname</Text>
        <TextInput
            placeholder="Enter Last Name"
            value={this.state.lastName}
            style={{padding:5, borderWidth:1, margin:5}}
        />
        <Text>Enter New Email Address</Text>
        <TextInput
            placeholder="Enter New Email Address"
            value={this.state.email}
            style={{padding:5, borderWidth:1, margin:5}}
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
  
    box1: {
    
      backgroundColor:('pink'),
      padding: 10,
    }
  })
    
  

export default EditPage;