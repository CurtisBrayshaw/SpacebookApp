/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  ScrollView, TextInput, StyleSheet, TouchableOpacity, Button, View, FlatList, displayAlert, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, { Text } from './styles';

class FriendPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      requestList: [],
      userList: [],
      input: '',
      info:{}
    };
  }
  
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getFriends();
    this.friendRequests();
    this.photoFromAsync();
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

  photoFromAsync = async() => {
    const data = await AsyncStorage.getItem('@photo'); 
    this.setState({
      photo: data,
    });
  }

  getCurrentUser = async () => {
    console.log('Getting profile...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          // isLoading: false,
          info: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getFriends = async () => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    // Validation here...

    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/friends`, {
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  asyncFriendslist = async () => {
    await AsyncStorage.setItem('@friends', this.state.data);
  };

  getUsers = async () => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const search = this.state.input;
    // Validation here...

    return fetch(`http://localhost:3333/api/1.0.0/search?q=${search}`, {
      method: 'get',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userList: responseJson,

        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendRequest = async (id) => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    // Validation here...

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptFriend = async (id) => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    // Validation here...

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'post',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  denyFriend = async () => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    // Validation here...

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'delete',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((response) => {
      
      })
      .catch((error) => {
        console.log(error);
      });
  };

  friendRequests = async () => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    // Validation here...

    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  vistFriendProfile = async (UID) => {
    await AsyncStorage.setItem('@friendUID', UID.toString());
    this.props.navigation.navigate('Friend Profile');
  };
  
  render() {
    return (
      <View style={styles.page}>
        <View style={styles.user}>
          <Image
            source={{ uri: this.state.photo
            }}
            style={styles.photo}
          />
          <Text>
            {this.state.info.first_name}{' '}{this.state.info.last_name}
          </Text>

          <Text>{this.state.info.friend_count} Friends</Text>
        </View>

        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Home'); }}>
            <Text> Home </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Friends'); }}>
            <Text> Friends </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Profile'); }}>
            <Text> Profile </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Logout'); }}>
            <Text> Logout </Text>
          </TouchableOpacity>
        </View>


        {/* Search Bar */}
        <View style={styles.searchbar}>
        <TextInput
          placeholder="Enter name"
          onChangeText={(input) => this.setState({ input })}
          value={this.state.input}
          style={{ borderWidth: 1, padding: 5 }}
          borderColor="black"
          placeholderTextColor={'white'}
        />

        {/* Search Button */}
        <TouchableOpacity onPress={() => this.getUsers(this.input)}>
            <Text> Search </Text>
          </TouchableOpacity> 
        </View>

        {/* Show Potential Friends */}
        <View style={{flex:1}}>
        <FlatList
          data={this.state.userList}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
              </Text>
              <TouchableOpacity onPress={() => this.sendRequest(item.user_id)}>
            <Text> Request </Text>
          </TouchableOpacity> 
          </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />
        </View>

        <View style={{flex:1}}>
        {/* Friend Requests */}
        <Text style={styles.title}>Friend Requests</Text>
        <FlatList
        data={this.state.requestList}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => this.acceptFriend(item.user_id)}>
            <Text> Accept</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={styles.button} onPress={() => this.denyFriend(item.user_id)}>
            <Text> Deny </Text>
          </TouchableOpacity> 
            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />
        </View>

        {/* Friends Text */}
        <View style={{flex:3}}>
          <Text style={styles.title}> Friends </Text>
        
        {/* Friends */}
        <FlatList
          style={{backgroundColor:'#0E1428'}}
          data={this.state.data}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Text>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => this.vistFriendProfile(item.user_id)}>
            <Text> Profile </Text>
          </TouchableOpacity> 
            
              </View>
            
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />
</View>
      </View>
    );
  }
}

export default FriendPage;
