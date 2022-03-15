import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import styles, { Text } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CameraPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  takePicture = async () => {
    console.log('taken');
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  sendToServer = async (data) => {
    console.log('sent');
    // Get these from AsyncStorage
    const session_token = await AsyncStorage.getItem('@session_token');
    const UID = await AsyncStorage.getItem('@UID');

    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${UID}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': session_token,
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

  render() {
    if (this.state.hasPermission) {
      return (
        <View style={styles.page}>
          <Camera
            style={styles.page}
            type={this.state.type}
            ref={(ref) => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity

                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    return (
      <Text>No access to camera</Text>
    );
  }
}

export default CameraPage;
