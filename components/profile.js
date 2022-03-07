/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  ScrollView, TextInput, Image, Button, View, FlatList, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class ProfilePage extends Component {
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

  sendToServer = async (data) => {
    // Get these from AsyncStorage
    const id = 10;
    const token = 'a3b0601e54775e60b01664b1a5273d54';
    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token,
      },
      body: blob,
    })
      .then((response) => {
        console.log('Picture added', response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCurrentUser = async () => {
    console.log('Getting profile...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${UID}`, {
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
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${UID}/post`, {
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

  async submitPost(input) {
    const state = {
      text: input,
    };
    console.log('Post Submitted');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${UID}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
      body: JSON.stringify(state),
    });
    
  }

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
    .then((response) => {})
      .then((response) => {
        this.getUserPosts();
        this.setState({
          // isLoading: false,
          postsData: responseJson,
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
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Edit Profile'); }}>
          <Text style={styles.editbutton}> Edit </Text>
        </TouchableOpacity>

        {/* Make Post */}
        <View>
          <TextInput
            placeholder="Write a post"
            onChangeText={(input) => this.setState({ input })}
            value={this.state.input}
            style={{ borderWidth: 1, padding: 5 }}
            borderColor="black"
          />
          <Button title="Make Post" color="green" onPress={() => this.submitPost(this.state.input)} />
        </View>

        {/* My Posts */}
        <View>
          <Text>My Posts</Text>
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

                {/* Edit Post Button */}
                <TouchableOpacity onPress={() => this.editPost(item.post_id)}>
                  <Text style={styles.editbutton}> Edit </Text>
                </TouchableOpacity>

                {/* Delete Post Button */}
                <TouchableOpacity onPress={() => this.deletePost(item.post_id)}>
                  <Text style={styles.editbutton}> Delete </Text>
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

export default ProfilePage;

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
