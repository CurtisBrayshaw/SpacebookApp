/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  ScrollView, TextInput, Image, Button, View, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, { Text } from './styles';

class ViewPostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      postData: {},
      postinfo: {},
      singlePost: {},
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
    this.postsDataFromAsync();
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

  async postsDataFromAsync() {
    const postData = await AsyncStorage.getItem('@userPost');
    this.setState({
      postData: JSON.parse(postData),
    });
  }

  getSinglePost = async () => {
    console.log('Getting posts...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const authorID = this.state.postData.author.user_id;
    const postID = this.state.postData.post_id;
    return fetch(`http://localhost:3333/api/1.0.0/user/${authorID}/post/${postID}`, {
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
          info: responseJson,
        });
        this.setState({
        // isLoading: false,
          email: this.state.info.author.email,
          first_name: this.state.info.author.first_name,
          last_name: this.state.info.author.last_name,
          numLikes: this.state.info.numLikes,
          text: this.state.info.text,
          timestamp: this.state.info.timestamp,
          userID: this.state.info.author.user_id,
          postID: this.state.info.post_id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updatePost = async (input) => {
    console.log('Getting profile...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = this.state.userID;
    const { postID } = this.state;
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post/${postID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
      body: JSON.stringify(
        {
          text: this.state.input,
        },
      ),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.getSinglePost();
        this.props.navigation.navigate('Home');
        this.props.navigation.navigate('Edit Post');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.page}>
        <View style={styles.postarea}>
          <View style={styles.post}>
            <Text>
              {this.state.first_name}
              {' '}
              {this.state.last_name}
              {' '}
              <Text style={{ justifyContent: 'flex-end' }}>{this.state.timestamp}</Text>
            </Text>
            <Text>{this.state.text}</Text>
            <Text>
              Likes:
              {this.state.numLikes}
            </Text>
            <TextInput
              style={styles.input}
              type="textarea"
              placeholder="Update your post"
              multiline
              onChangeText={(input) => this.setState({ input })}
            />
            {/* Edit Post Button */}
            <TouchableOpacity onPress={() => this.updatePost()}>
              <Text> Edit </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ViewPostPage;
