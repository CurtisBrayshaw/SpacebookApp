/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  ScrollView, TextInput, StyleSheet, Button, View, FlatList, Text, displayAlert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles"
class FriendPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      requestList: [],
      userList: [],
      input: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getFriends();
    this.friendRequests();
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

  getFriends = async () => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    // Validation here...

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${UID}/friends`, {
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

    return fetch(`http://10.0.2.2:3333/api/1.0.0/search?q=${search}`, {
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

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}/friends`, {
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

    return fetch(`http://10.0.2.2:3333/api/1.0.0/friendrequests/${id}`, {
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

    return fetch(`http://10.0.2.2:3333/api/1.0.0/friendrequests/${id}`, {
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

  friendRequests = async () => {
    const UID = await AsyncStorage.getItem('@UID');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    // Validation here...

    return fetch('http://10.0.2.2:3333/api/1.0.0/friendrequests', {
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
        this.setState({
          isLoading: false,
          requestList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  vistFriendProfile = async (UID) => {
    await AsyncStorage.setItem('@friendUID', UID.toString());
    this.props.navigation.navigate('Friend Profile')
  };

  render() {
    return (
      <View style={styles.page}>
        {/* Search Bar */}
        <TextInput
          placeholder="Enter name"
          onChangeText={(input) => this.setState({ input })}
          value={this.state.input}
          style={{ borderWidth: 1, padding: 5 }}
          borderColor="black"
        />

        {/* Search Button */}
        <View style={styles.box1}>
          <Button
            title="Search"
            color="red"
            onPress={() => this.getUsers(this.input)}
          />
        </View>

        {/* Friends Text */}
        <View>
          <Text> Friends </Text>
        </View>

        {/* Show Potential Friends */}
        <FlatList
          data={this.state.userList}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
              </Text>
              <Button title="Request" color="red" onPress={() => this.sendRequest(item.user_id)} />
            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />

        {/* Friends */}
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Text>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
              </Text>
              <Button title="Profile" onPress={() => this.vistFriendProfile(item.user_id)} />
            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />
        
        {/* Friend Requests */}
        <Text>Friend Requests</Text>
        <FlatList
          data={this.state.requestList}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <Button title="Accept" onPress={() => this.acceptFriend(item.user_id)} />
              <Button title="Deny" onPress={() => this.denyFriend(item.user_id)} />
            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />
      </View>
    );
  }
}



export default FriendPage;
