/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  ScrollView, TextInput, Image, Button, View, FlatList, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class ViewPostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      postsData: [],
      UID: null,
      postID: null,
      postinfo: {}
    };
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
    this.getSinglePost();
  }

  componentWillUnmount() {
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  getSinglePost = async () => {
    console.log('Getting posts...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    const postID = await AsyncStorage.getItem('@postID');
    return fetch(`http://192.168.0.48:3333/api/1.0.0/user/${UID}/post/${postID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // isLoading: false,
          postinfo: responseJson,
          
        });
        console.log(this.state.postsData)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async deletePost(postID) {
    console.log('Post Deleted');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${UID}/post/${postID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => {
        this.getUserPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updatePost = async (postID) => {
    console.log('Getting profile...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${UID}/post/` + postID, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
      body: JSON.stringify(
        {
        text: input
        }
        )
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
        <View>
          <Text>{this.state.postinfo.author.first_name}</Text>
          <Text>{this.state.postinfo.text}</Text>
          <Text></Text>
          <Text></Text>
                <TouchableOpacity onPress={() => this.likePost(item.author.user_id, item.post_id)}>
                  <Text style={styles.editbutton}> Like </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.unlikePost(item.author.user_id, item.post_id)}>
                  <Text style={styles.editbutton}> Unlike </Text>
                </TouchableOpacity>
                
              </View>
            )}
}

export default ViewPostPage;

const styles = StyleSheet.create({

  button: {
    backgroundColor: ('lightblue'),
    padding: 10,
  },
  editbutton: {
    backgroundColor: ('white'),
    padding: 10,
    alignItems: 'flex-end',
  },
  posts: {
    backgroundColor: ('lightblue'),
    margin: 5,
    padding: 0,
    alignItems: 'flex-start',
  },
});