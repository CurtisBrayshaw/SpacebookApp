/* eslint-disable react/jsx-filename-extension */

import React, {Component} from 'react';
import {
  ScrollView, TextInput, Image, Button, View, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles, {Text} from "./styles"
class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      postsData: [],
      UID: null,
      picURL: null
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

  getUserPosts = async () => {
    console.log('Getting posts...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post`, {
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
          postsData: responseJson,
          
        });
        console.log(responseJson)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async postDatatoAsync(item){
    item = JSON.stringify(item)
    await AsyncStorage.setItem('@userPost', item);
    this.props.navigation.navigate('Single Post')
  }



  async submitPost(input) {
    const state = {
      text: input,
    };
    console.log('Post Submitted');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
      body: JSON.stringify(state),
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

  async deletePost(postID) {
    console.log('Post Deleted');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post/${postID}`, {
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

  updatePost = async (postID, input) => {
    console.log('Getting profile...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/post/` + postID, {
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
<View style = {styles.page}>

  <View style={styles.user}>
        <Image style={{width: 80, height: 80,borderWidth: 5, backgroundColor: "grey",}} source={{ uri: this.state.photo }} />
        <Text> 
        {this.state.info.first_name}</Text>
        <Text>
        {this.state.info.last_name}</Text>
        <Text>
        {this.state.info.email}</Text>
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Edit Profile'); }}>
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
  <View>
          <TextInput
          style= {styles.input}
          type = "textarea"
          placeholder="Write a post"
          multiline = {true}
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
  <View style={styles.post}>
              <View style={styles.post}>
                <Text>{item.author.first_name} {item.author.last_name} {item.timestamp}</Text>
                <Text>{item.text}</Text>
                <Text>Likes:{item.numLikes}</Text>
                </View>
                <View style={styles.postbar}>
                {/* View Post Button */}
                <TouchableOpacity onPress={() => {this.postDatatoAsync(item)}}>
                  <Text> View </Text>
                </TouchableOpacity>

                {/* Delete Post Button */}
                <TouchableOpacity onPress={() => this.deletePost(item.post_id.toString())}>
                  <Text> Delete </Text>
                </TouchableOpacity>

                {/* Edit Post Button */}
                <TouchableOpacity onPress={() => this.updatePost(item.author.post_id)}>
                  <Text> Edit </Text>
                </TouchableOpacity>
                </View>
  </View>)}/>
  </View>
</View>
    );
  }
}
export default ProfilePage;


