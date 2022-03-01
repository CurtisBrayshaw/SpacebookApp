import React, { Component } from 'react';
import { ScrollView, TextInput, StyleSheet, Button, View, FlatList,Text, displayAlert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendPage extends Component{
constructor(props){
super(props);

this.state = {
data:[],
requestList: [],
}
}
componentDidMount() {
this.unsubscribe = this.props.navigation.addListener('focus', () => {
this.checkLoggedIn();
});
// call functions here
this.Showfriends();
this.FriendRequests();
}

componentWillUnmount() {
this.unsubscribe();
}

checkLoggedIn = async () => {
const UID = await AsyncStorage.getItem('@UID');
const sessionToken = await AsyncStorage.getItem('@session_token');
if (sessionToken == null) {
this.props.navigation.navigate('Login');
}
};

addItemToList = () => {
let newItems = this.state.items.concat(this.state.temp_item);
this.setState({
items: newItems,
temp_item: ""
});
}

Showfriends = async () => {
const UID = await AsyncStorage.getItem('@UID');
const sessionToken = await AsyncStorage.getItem('@session_token');
//Validation here...

return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + UID + "/friends", {
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

FriendRequests = async () => {
const UID = await AsyncStorage.getItem('@UID');
const sessionToken = await AsyncStorage.getItem('@session_token');
//Validation here...

return fetch("http://10.0.2.2:3333/api/1.0.0/friendrequests", {
method: 'get',
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
requestList: responseJson
})
})
.catch((error) => {
console.log(error);
})
}

render(){
return (
<View>
  
{/* Search Bar */}
<TextInput
placeholder='enter friend name'
style = {{borderWidth: 1}}
borderColor = 'black'            
/>

{/* Friends */}
<FlatList
data={this.state.data}
renderItem={({item}) => (
<View>
<Text>{item.user_givenname} {item.user_familyname}</Text>
</View>
)}
keyExtractor={(item,index) => item.user_id.toString()}
/>

{/* Friend Requests */}
<FlatList
data={this.state.requestList}
renderItem={({item}) => (
<View style={styles.box}>
<Text>Friend Requests</Text>
<Text>{item.first_name} {item.last_name}</Text>
<Button title="Accept" />
<Button title="Deny" />
</View>
)}
keyExtractor={(item,index) => item.user_id.toString()}
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

export default FriendPage;