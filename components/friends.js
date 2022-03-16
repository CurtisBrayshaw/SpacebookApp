/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  ScrollView, TextInput, TouchableOpacity, View, FlatList, Image,
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
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getFriends();
    this.friendRequests();
    this.photoFromAsync();
    this.friendRequests();
    this.UserfromAsync();
    this.getUsers();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    if (sessionToken == null) {
      this.props.navigation.navigate('Login');
    }
  };

  photoFromAsync = async () => {
    const data = await AsyncStorage.getItem('@photo');
    this.setState({
      photo: data,
    });
  };

  UserfromAsync = async () => {
    const first_name = await AsyncStorage.getItem('@first_name');
    const last_name = await AsyncStorage.getItem('@last_name');
    const friend_count = await AsyncStorage.getItem('@friend_count');
    this.setState({
      first_name,
      last_name,
      friend_count,
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
          data: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUsers = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const search = this.state.input;

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
          userList: responseJson,

        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendRequest = async (id) => {
    const sessionToken = await AsyncStorage.getItem('@session_token');

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
          userList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptFriend = async (id) => {
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
          userList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  denyFriend = async (id) => {
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
        this.friendRequests();
        this.setState({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  friendRequests = async () => {
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
        if (response.status === 200 || 201) {
          return response.json();
        } this.errorHandle(response.status);
      })
      .then((responseJson) => {
        this.setState({
          requestList: responseJson,
        });
        console.log(this.state.requestList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  vistFriendProfile = async (UID) => {
    await AsyncStorage.setItem('@friendUID', UID.toString());
    this.props.navigation.navigate('Friend Profile');
  };

  errorHandle(status) {
    if (status === 400) {
      throw 'Bad Request';
    } if (status === 401) {
      throw 'Unauthorised';
    } if (status === 403) {
      throw 'Forbidden';
    } if (status === 404) {
      throw 'Not Found';
    } if (status === 500) {
      throw 'Server Error';
    }
  }

  render() {
    return (
      <View style={styles.page}>

        {/* User Information */}
        <View style={styles.user}>
          <Image source={{ uri: this.state.photo }} style={styles.photo} />
          <Text>
            {this.state.first_name}
            {' '}
            {this.state.last_name}
          </Text>
          <Text>
            {this.state.friend_count}
            {' '}
            Friends
            {' '}
          </Text>
        </View>

        {/* NavBar */}
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

        <ScrollView>
          <View style={{ flex: 7 }}>
            <View style={styles.searchbar}>
              {/* Search Bar */}
              <TextInput
                placeholder="Enter name"
                onChangeText={(input) => this.setState({ input })}
                value={this.state.input}
                borderColor="black"
                numberOfLines={1}
                placeholderTextColor="white"
              />

              {/* Search Button */}
              <TouchableOpacity onPress={() => this.getUsers(this.input)}>
                <Text> Search </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3, minHeight: '40%', minWidth: '100%' }}>
              {/* Friend Search Output */}
              <FlatList
                style={{ flex: 1 }}
                data={this.state.userList}
                renderItem={({ item }) => (
                  <View>
                    <Text>
                      {item.user_givenname}
                      {' '}
                      {item.user_familyname}
                    </Text>
                    <TouchableOpacity style={styles.friendsbutton} onPress={() => this.sendRequest(item.user_id)}>
                      <Text> Request </Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
              />

            </View>
            <Text style={styles.title}> Friends </Text>
            <View style={styles.requests}>

              {/* Friends */}
              <FlatList
                style={styles.requests}
                data={this.state.data}
                renderItem={({ item }) => (
                  <View style={styles.post}>
                    <Text style={{ paddingRight: 110, paddingLeft: 110 }}>
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
            <Text style={styles.title}>Friend Requests</Text>
            <View style={styles.requests}>
              {/* Friend Requests */}

              <FlatList
                style={styles.requests}
                data={this.state.requestList}
                renderItem={({ item }) => (
                  <View>
                    <Text>
                      {item.first_name}
                      {' '}
                      {item.last_name}
                    </Text>
                    <TouchableOpacity style={styles.friendsbutton} onPress={() => this.acceptFriend(item.user_id)}>
                      <Text> Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.friendsbutton} onPress={() => this.denyFriend(item.user_id)}>
                      <Text> Deny </Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default FriendPage;
