/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Button, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import styles from "./styles"

class EditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      email: null,
      hasPermission: null,
      type: Camera.Constants.Type.back,
      first_name: null,
      last_name: null,
      email: null,
      password:null
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'Denied' });
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.notNull();
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

  cameraToggle = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  };

  sendToServer = async (data) => {
    // Get these from AsyncStorage
    console.log("Sent to server..")
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + UID + "/photo", {
        method: "POST",
        headers: {
            "Content-Type": "image/png",
            "X-Authorization": session_token
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
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      console.log("picture taken")
      await this.camera.takePictureAsync(options);
    }
  };

  updateProfile = async () => {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UID, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': session_token
      },
      
      body: JSON.stringify(
        {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password
        }
        )
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          //isLoading: false,
          allinfo: responseJson
          })
        
        })
      .catch((error) => {
          console.log(error);
    });
  }

notNull = async () => {
  this.setState({first_name:await AsyncStorage.getItem('@first_name')})
  console.log(this.state.first_name)
    
  this.setState({last_name:await AsyncStorage.getItem('@last_name')})
  console.log(this.state.last_name)
    
  this.setState({email:await AsyncStorage.getItem('@email')})
  console.log(this.state.email)

  this.setState({password:await AsyncStorage.getItem('@password')})
}

  render() {
    if (this.state.hasPermission) {
      return (
<View style={styles.page}>
          <Camera style={styles.button} type={this.state.type} ref={(ref) => this.camera = ref}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  const type = type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;

                  this.setState({ type });
                }}
              >
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={styles.text}> Capture </Text>
              </TouchableOpacity>

            </View>
          </Camera>
</View>
      );
    }
    return (
      <View style={styles.page}>
        <View>
          <Button title="Take Picture" onPress={() => this.cameraToggle()} />
          <Text>
            {this.state.info.first_name}
            {' '}
            {this.state.info.last_name}
          </Text>
          
        </View>
        <Text>Enter New First Name</Text>
        <TextInput
          placeholder="Enter First Name"
          onChangeText={(first_name) => this.setState({ first_name })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Surname</Text>
        <TextInput
          placeholder="Enter Last Name"
          onChangeText={(last_name) => this.setState({ last_name })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Email Address</Text>
        <TextInput
          placeholder="Enter New Email Address"
          onChangeText={(email) => this.setState({ email })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Password</Text>
        <TextInput
          placeholder="Enter New Password"
          onChangeText={(password) => this.setState({ password })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button title="Submit" onPress={() => this.updateProfile() & this.props.navigation.navigate('Home')} />
        <Button title="Back"  onPress={() => this.cameraToggle} />
      </View>
    );
  }
}

export default EditPage;
