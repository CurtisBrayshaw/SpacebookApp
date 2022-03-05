import React, { Component } from 'react';
import { ScrollView, TextInput, Button, View, FlatList,Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Camera} from 'expo-camera';

class ProfilePage extends Component{
  constructor(props){
      super(props);

      this.state = {
          data:[],
          info: {},
          hasPermission: null,
          type: Camera.Constants.Type.back,
          postsData: []
      }
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'denied'})
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserPosts();
    this.getCurrentUser();
  };

  componentWillUnmount() {
  
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  cameraToggle = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'})
  }

  showfriends = async () => {
      const UID = await AsyncStorage.getItem('@UID');
      const sessionToken = await AsyncStorage.getItem('@session_token');
      //Validation here...

      return fetch("http://10.0.2.2:3333/api/1.0.0/user/6", {
          'headers': {
            'X-Authorization':  sessionToken
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            data: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }
  sendToServer = async (data) => {
    // Get these from AsyncStorage
    let id = 10;
    let token = "a3b0601e54775e60b01664b1a5273d54"
    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
        method: "POST",
        headers: {
            "Content-Type": "image/png",
            "X-Authorization": token
        },
        body: blob
    })
    .then((response) => {
        console.log("Picture added", response);
    })
    .catch((err) => {
        console.log(err);
    })
}

  takePicture = async () => {
      if(this.camera){
          const options = {
              quality: 0.5, 
              base64: true,
              onPictureSaved: (data) => this.sendToServer(data)
          };
          await this.camera.takePictureAsync(options); 
      } 
  }

  getCurrentUser = async() => {
    console.log("Getting profile...");
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': session_token
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            //isLoading: false,
            info: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getUserPosts = async() => {
    console.log("Getting posts...");
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UID + "/post", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': session_token
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            //isLoading: false,
            postsData: responseJson
        })
        console.log(this.state.postsData)
    })
    .catch((error) => {
        console.log(error);
    });
  }

    likePost = async(postID) => {
    console.log("Post Liked");
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UID + "/post/" + postID + '/like', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': session_token
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            //isLoading: false,
            postsData: responseJson
        })
        console.log(this.state.postsData)
    })
    .catch((error) => {
        console.log(error);
    });
  }

render(){
  if(this.state.hasPermission){
return(
  <View style={styles.button}>
          <Camera style={styles.button} type={this.state.type} ref={ref => this.camera = ref}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  let type = type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back;

                  this.setState({type: type});
                }}>
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>



              <TouchableOpacity
                onPress={() => {
                  this.takePicture();}}>
                <Text style={styles.text}> Capture </Text>
              </TouchableOpacity>

              
              
            </View>
          </Camera>
        </View>
      );
    }else{
      return(
  <View>
  <Text>Name:{this.state.info.first_name} {this.state.info.last_name}</Text>
  <Text>Email Address: {this.state.info.email}</Text>
  <Button title="Take Picture" color="green" onPress={() => this.cameraToggle()} />
  <TouchableOpacity onPress={() => {this.props.navigation.navigate("Edit Profile")}}>
  <Text style={styles.editbutton}> Edit </Text> 
  </TouchableOpacity>
  
  {/* Search Bar*/}
  <TextInput
  placeholder='Write a post'
  onChangeText={(input) => this.setState({input})}
  value={this.state.input}
  style = {{borderWidth: 1, padding: 5}}
  borderColor = 'black'            
  /> 
      <View>
      <Text>My Posts</Text>
      <FlatList 
      data = {this.state.postsData}
      renderItem={({item}) => (
      <View style = {styles.posts}>
      <Text>{item.author.first_name} {item.author.last_name} {item.timestamp}</Text>
      <Text>{item.text}</Text>
      <Text>Likes: {item.numLikes} </Text>
      <TouchableOpacity onPress={() => this.likePost(item.post_id)}>
      <Text style={styles.editbutton}> Like </Text> 
      </TouchableOpacity>
      </View>
      )}
      keyExtractor={(item,index) => item.post_id.toString()}
      /> 
      </View>



  </View>
   );
    }
  }
}

export default ProfilePage;

const styles = StyleSheet.create({

  button: {
    flex: 1,
    backgroundColor:('lightblue'),
    padding: 10
  },
  editbutton:{
    backgroundColor:('white'),
    padding: 10,
    alignItems: "flex-end"
  },
  posts:{
    backgroundColor:('lightblue'),
    margin: 5,
    padding: 0,
    alignItems: "flex-start"
  }
});