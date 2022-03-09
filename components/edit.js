/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, FlatList, Image, Button, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class EditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      email: null,
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'Denied' });
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
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

    return fetch("http://192.168.0.48:3333/api/1.0.0/user/" + UID + "/photo", {
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

  async updateProfile(inputFN, inputSN, inputEmail) {
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');
    const state = {
      text: input,
    };
    return fetch(`http://192.168.0.48:3333/api/1.0.0/user/${UID}`, {
      method: 'GET',
      headers: {
        'X-Authorization': session_token,
        'Content-Type': 'application/json',
      },
      body: {

      }
    })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.hasPermission) {
      return (
        <View style={styles.button}>
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
      <View>
        <View style={styles.box}>
          <Button title="Take Picture" color="green" onPress={() => this.cameraToggle()} />
          <Text>
            {this.state.info.first_name}
            {' '}
            {this.state.info.last_name}
          </Text>
        </View>
        <Text>Enter New First Name</Text>
        <TextInput
          placeholder="Enter First Name"
          onChangeText={(inputFN) => this.setState({ inputFN })}
          FN={this.state.inputFN}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Surname</Text>
        <TextInput
          placeholder="Enter Last Name"
          onChangeText={(inputSN) => this.setState({ inputSN })}
          SN={this.state.inputSN}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Email Address</Text>
        <TextInput
          placeholder="Enter New Email Address"
          onChangeText={(inputEmail) => this.setState({ inputEmail })}
          email={this.state.inputEmail}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Password</Text>
        <TextInput
          placeholder="Enter New Password"
          onChangeText={(inputPassword) => this.setState({ inputPassword })}
          password={this.state.inputPassword}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button title="Submit" color="green" onPress={() => this.updateProfile(FN, SN ,email,password)} />
        <Button title="Back" color="green" onPress={() => this.cameraToggle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {

    backgroundColor: ('lightblue'),
    padding: 10,
  },

  box1: {

    backgroundColor: ('pink'),
    padding: 10,
  },
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

export default EditPage;
