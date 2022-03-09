/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  ScrollView, TextInput, Image, Button, View, FlatList, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      postsData: [],
      UID: null,
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

  getCurrentUser = async () => {
    console.log('Getting profile...');
    const friendUID = await AsyncStorage.getItem('@friendUID');
    const session_token = await AsyncStorage.getItem('@session_token');
    return fetch('http://192.168.0.48:3333/api/1.0.0/user/' + friendUID, {
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

  getUserPosts = async () => {
    console.log('Getting posts...');
    const friendUID = await AsyncStorage.getItem('@friendUID');
    const session_token = await AsyncStorage.getItem('@session_token');
    console.log(friendUID)
    return fetch('http://192.168.0.48:3333/api/1.0.0/user/'+ friendUID +'/post', {
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
  async likePost(friendID,PID) {
    
    console.log('Post Liked');
    const session_token = await AsyncStorage.getItem('@session_token');
    console.log(friendID)
    return fetch(`http://192.168.0.48:3333/api/1.0.0/user/` + friendID + `/post/${PID}/like`, {
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
  async unlikePost(friendID,PID) {
    
    console.log('Post Liked');
    const session_token = await AsyncStorage.getItem('@session_token');
    console.log(friendID)
    return fetch(`http://192.168.0.48:3333/api/1.0.0/user/` + friendID + `/post/${PID}/like`, {
      method: 'DELETE',
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
  render() {
    return (
      <View>
        <Image style={styles.logo} source={{ uri: this.state.photo }} />
        <Text>
          Name: 
          {this.state.info.first_name}
          {' '}
          {this.state.info.last_name}
        </Text>
        <Text>
          Email Address:
          {this.state.info.email}
        </Text>


        {/* Posts */}
        <View>
          <Text>Posts</Text>
          <FlatList
            data={this.state.postsData}
            renderItem={({ item }) => (
              <View style={styles.posts}>
                <Text>
                  {item.author.first_name}
                  {' '}
                  {item.author.last_name}
                  {' '}
                  {item.timestamp}
                </Text>
                <Text>{item.text}</Text>
                <Text>
                  Likes: 
                  {item.numLikes}
                </Text>
                
                <TouchableOpacity onPress={() => this.likePost(item.author.user_id, item.post_id)}>
                  <Text style={styles.editbutton}> Like </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.unlikePost(item.author.user_id, item.post_id)}>
                  <Text style={styles.editbutton}> Unlike </Text>
                </TouchableOpacity>
                
              </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
          />
        </View>

      </View>
    );
  }
}

export default FriendProfilePage;

const styles = StyleSheet.create({

  button: {
    flex: 1,
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
