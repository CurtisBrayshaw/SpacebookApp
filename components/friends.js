import React, { Component } from 'react';
import { ScrollView, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            data:[],
        }
    }
    render(){
        return (
            <ScrollView>
               
            </ScrollView>
        )
    } 
}
export default FriendPage;