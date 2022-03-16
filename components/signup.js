import React, { Component } from 'react';
import { Button, ScrollView, TextInput } from 'react-native';
import styles from './styles';

class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      errortext: '',
    };
  }

  signup = () => {
    if (this.state.password.length < 8) {
      this.setState({
        errortext: 'Password not long enough',
      });
    }

    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState({
          isLoading: false})
          return response.json();
        } if (response.status === 400) {
          throw 'Failed validation';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log('User created with ID: ', responseJson);
        this.props.navigation.navigate('Login');
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
      <ScrollView>
        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button
          title="Create an account"
          onPress={() => this.signup()}
        />
      </ScrollView>
    );
  }
}

export default SignupPage;
