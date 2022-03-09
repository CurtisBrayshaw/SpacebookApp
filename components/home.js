/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Button, Image, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      picURL: null,
      UID: [],
    };
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getProfilePhoto();
    this.getCurrentUser();
    this.getFriends();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getProfilePhoto = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://192.168.0.48:3333/api/1.0.0/user/' + UID + '/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': session_token,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        console.log(resBlob);
        const data = URL.createObjectURL(resBlob);
        this.state.picURL = data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getCurrentUser = async () => {
    console.log('Getting profile...');
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch(`http://192.168.0.48:3333/api/1.0.0/user/${UID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          // isLoading: false,
          info: responseJson,

        });
      })
      .then(async (responseJson) => {
        // console.log(responseJson);
        // await AsyncStorage.setItem('@first_name', responseJson.first_name);
        // await AsyncStorage.setItem('@last_name', responseJson.last_name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getFriends = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://192.168.0.48:3333/api/1.0.0/user/' + UID + '/friends', {
      method: 'GET',
      headers: {
        'X-Authorization': session_token,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          // isLoading: false,
          friendsData: responseJson,
        });
        console.log (friendsData.post_id)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPosts = async (friendsData) => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://192.168.0.48:3333/api/1.0.0/user/' + this.state.UID +  '/post' ,{
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

  render() {
    return (
      <View style={styles.page}>

        <View style={styles.box}>
          <Image style={styles.logo} source={{
          url : this.state.picURL
          }} />
          <Text>
            Name:
            {' '}
            {this.state.info.first_name}
            {' '}
            {this.state.info.last_name}
            {' '}
          </Text>
          <Text>
            Friends:
            {this.state.info.friend_count}
            {' '}
          </Text>
        </View>

        {/* Posts Feed */}
          {/* <Text>My Posts</Text>
          <FlatList
            data={this.state.postsData}
            renderItem={({ item }) => (
              <View>
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
                </Text> */}
                {/* <TouchableOpacity onPress={() => this.editPost(item.post_id)}>
                  <Text style={styles.editbutton}> Edit </Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => this.deletePost(item.post_id)}>
                  <Text style={styles.editbutton}> Delete </Text>
                </TouchableOpacity> */}
              {/* </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
          /> */}
        

        <View style={styles.button}>
          <Button
            title="Friends"
            onPress={() => this.props.navigation.navigate('Friends')}
          />
          <Button
            title="Profile"
            onPress={() => this.props.navigation.navigate('Profile')}
          />
          <Button
            title="Logout"
            onPress={() => this.props.navigation.navigate('Logout')}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  box: {
    backgroundColor: ('white'),
    padding: 10,

  },
  button: {
    flexWrap: 'wrap',
    alignContent: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    color: 'green',
    width: 80,
    height: 300,
    flexDirection: 'row',
  },

  logo: {
    width: 50,
    height: 50,
  },
  page: {
    flex: 1,
    padding: 5,
    width: 500,
    height: 500,
    backgroundColor: ('lightblue'),
  },
  posts: {
    backgroundColor: ('lightblue'),
    margin: 5,
    padding: 0,
    alignItems: 'flex-start',
  },
});

export default HomePage;
