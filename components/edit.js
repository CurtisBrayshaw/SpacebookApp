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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'denied' });
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  cameraToggle = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  async updateProfile() {

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
          inputFN={this.state.firstName}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Surname</Text>
        <TextInput
          placeholder="Enter Last Name"
          inputSN={this.state.lastName}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Text>Enter New Email Address</Text>
        <TextInput
          placeholder="Enter New Email Address"
          inputEmail={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button title="Submit" color="green" onPress={() => this.updateProfile(inputFN, inputSN, inputEmail)} />
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
