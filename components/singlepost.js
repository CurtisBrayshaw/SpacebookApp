/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {TextInput, View, TouchableOpacity, Image} from 'react-native';
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
    this.photoFromAsync();
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

  photoFromAsync = async() => {
    const data = await AsyncStorage.getItem('@photo'); 
    this.setState({
      photo: data,
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
        info: responseJson,
        });
        this.setState({
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
        this.setState({
        isLoading: false})
      })
      .catch((error) => {
        console.log(error);
      });
  };
  errorHandle(status){
    if (status === 400) {
     throw 'Bad Request';
   }if (status === 401) {
     throw 'Unauthorised';
   }if (status === 403) {
     throw 'Forbidden';
   }if (status === 404) {
     throw 'Not Found';
   }if (status === 500) {
     throw 'Server Error';
   }}
  render() {
    return (
      <View style={styles.page}>
        <View style={styles.user}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={styles.photo}
          />
          <Text>
            {this.state.info.first_name}{' '}{this.state.info.last_name}
          </Text>

          <Text>{this.state.info.friend_count} Friends</Text>
        </View>


            {/* Nav */}
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
              numberOfLines={5}
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
