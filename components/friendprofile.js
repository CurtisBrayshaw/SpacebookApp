/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  ScrollView, TextInput, Image, Button, View, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, { Text } from './styles';

class FriendProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      postsData: [],
      UID: null,
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserPosts();
    this.getCurrentUser();
  }

  componentWillUnmount() {
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  getCurrentUser = async () => {
    console.log('Getting profile...');
    const friendUID = await AsyncStorage.getItem('@friendUID');
    const session_token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${friendUID}`, {
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

  async postDatatoAsync(item) {
    item = JSON.stringify(item);
    await AsyncStorage.setItem('@userPost', item);
    this.props.navigation.navigate('Single Post');
  }

  getUserPosts = async () => {
    console.log('Getting posts...');
    const friendUID = await AsyncStorage.getItem('@friendUID');
    const session_token = await AsyncStorage.getItem('@session_token');
    console.log(friendUID);
    return fetch(`http://localhost:3333/api/1.0.0/user/${friendUID}/post`, {
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
          postsData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async likePost(friendID, PID) {
    console.log('Post Liked');
    const session_token = await AsyncStorage.getItem('@session_token');
    console.log(friendID);
    return fetch(`http://localhost:3333/api/1.0.0/user/${friendID}/post/${PID}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => {})
      .then((response) => {
        this.getUserPosts();
        this.setState({
          // isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async unlikePost(friendID, PID) {
    console.log('Post Liked');
    const session_token = await AsyncStorage.getItem('@session_token');
    console.log(friendID);
    return fetch(`http://localhost:3333/api/1.0.0/user/${friendID}/post/${PID}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => {

        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw 'Invalid email or password';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((response) => {
        this.getUserPosts();
        this.setState({
          // isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      // User
      <View style={styles.page}>
      <View style={styles.user}>
          <Image style={styles.photo} source={{ uri: this.state.photo }} />
          <View style={{flex:2, alignItems:'flex-start',}}>
          <Text>{this.state.info.first_name}</Text>
          <Text>{this.state.info.last_name}</Text>
          <Text>{this.state.info.email}</Text>
          </View>4
        </View>

        {/* Make Post */}
          <View>
          <TextInput
            style={styles.compose}
            type="textarea"
            placeholder="Write a post"
            multiline={true}
            numberOfLines="5"
          // autoCapitalize = "true"
            onChangeText={(input) => this.setState({ input })}
            value={this.state.input}
          />
          <TouchableOpacity onPress={() => this.submitPost(this.state.input)}>
            <Text style={styles.button}> Submit </Text>
          </TouchableOpacity>
        </View>

        {/* Posts */}
      <View style={styles.postarea}>
          <Text style={styles.title}>Your Posts</Text>
          <FlatList
            data={this.state.postsData}
            keyExtractor={(item, index) => item.post_id.toString()}
            renderItem={({ item }) => (
            
            <View style={styles.post}>
                  <Text>{item.author.first_name} {item.author.last_name} at {item.timestamp}
                  </Text>
                  <Text>{item.text}</Text>
                  <Text>
                    Likes:
                    {item.numLikes}
                  </Text>
              <View style={styles.postbar}>

                  {/* View Post Button */}
                  <TouchableOpacity onPress={() => { this.postDatatoAsync(item); }}>
                    <Text> View </Text>
                  </TouchableOpacity>

                  {/* Delete Post Button */}
                  <TouchableOpacity onPress={() => this.deletePost(item.post_id.toString())}>
                    <Text> Delete </Text>
                  </TouchableOpacity>

                  {/* Like Button */}
                  <TouchableOpacity onPress={() => this.likePost(item.author.user_id, item.post_id)}>
                  <Text> Like </Text>
                  </TouchableOpacity>

                  {/* Unlike Button */}
                  <TouchableOpacity onPress={() => this.unlikePost(item.author.user_id, item.post_id)}>
                  <Text> Unlike </Text>
                  </TouchableOpacity>
                  </View>
                  </View>
                
              
            )}
          />
        </View>
















        {/* page view  */}
      </View>
      
    );
  }
}

export default FriendProfilePage;
