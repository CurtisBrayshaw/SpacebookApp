/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  TextInput, Image, View, FlatList, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, { Text } from './styles';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      postsData: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserPosts();
    this.getCurrentUser();
    this.photoFromAsync();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  getCurrentUser = async () => {
    console.log('Getting profile...');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          info: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  photoFromAsync = async () => {
    const data = await AsyncStorage.getItem('@photo');
    this.setState({
      photo: data,
    });
  };

  getUserPosts = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          postsData: responseJson,

        });
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async deletePost(postID) {
    console.log('Post Deleted');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post/${postID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken,
      },
    })
      .then(() => {
        this.setState({ isLoading: false });
        this.getUserPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async submitPost(input) {
    const state = {
      text: input,
    };
    console.log('Post Submitted');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken,
      },
      body: JSON.stringify(state),
    })
      .then(() => {})
      .then(() => {
        this.getUserPosts();
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async postDatatoAsync(item) {
    item = JSON.stringify(item);
    await AsyncStorage.setItem('@userPost', item);
    this.props.navigation.navigate('Single Post');
  }

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
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0E1428',
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    }
    return (
      <View style={styles.page}>

        <View style={styles.user}>
          <Image style={styles.photo} source={{ uri: this.state.photo }} />
          <View style={{ flex: 2, alignItems: 'flex-start' }}>
            <Text>{this.state.info.first_name}</Text>
            <Text>{this.state.info.last_name}</Text>
            <Text>{this.state.info.email}</Text>
          </View>
          <TouchableOpacity style={{}} onPress={() => { this.props.navigation.navigate('Edit Profile'); }}>
            <Text> Edit Profile </Text>
          </TouchableOpacity>
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

        {/* Make Post */}
        <View style={styles.compose}>
          <TextInput
            style={styles.compose}
            type="textarea"
            placeholder="Write a post"
            multiline
            numberOfLines="4"
            placeholderTextColor="white"
            onChangeText={(input) => this.setState({ input })}
            value={this.state.input}
          />
          <TouchableOpacity onPress={() => this.submitPost(this.state.input)}>
            <Text style={styles.button}> Submit </Text>
          </TouchableOpacity>
        </View>

        {/* My Posts */}
        <View style={styles.postarea}>
          <Text style={styles.title}>Your Posts</Text>
          <FlatList
            data={this.state.postsData}
            keyExtractor={(item, index) => item.post_id.toString()}
            renderItem={({ item }) => (
              <View style={{ minWidth: '100%' }}>
                <View style={styles.post}>
                  <Text>
                    {item.author.first_name}
                    {' '}
                    {item.author.last_name}
                    {' '}
                    at
                    {' '}
                    {item.timestamp}
                  </Text>
                  <Text>{item.text}</Text>
                  <Text>
                    Likes:
                    {item.numLikes}
                  </Text>
                  {/* View Post Button */}
                  <TouchableOpacity onPress={() => { this.postDatatoAsync(item); }}>
                    <Text> View </Text>
                  </TouchableOpacity>

                  {/* Delete Post Button */}
                  <TouchableOpacity style={{ width: '50%', height: '20%' }} onPress={() => this.deletePost(item.post_id.toString())}>
                    <Text> Delete </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
export default ProfilePage;
