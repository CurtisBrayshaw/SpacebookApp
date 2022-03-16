/* eslint-disable linebreak-style */
import { StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';

export default StyleSheet.create({

  // edit
  // friendprofile
  // friends
  // home
  // login
  // logout
  // profile
  // signup
  // singlepost

  page: {
    backgroundColor: '#0E1428',
    flex: 1,
    alignContent: 'flex-start',
  },
  user: {
    backgroundColor: '#3285a8',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    minHeight: '13%',
  },
  navbar: {
    backgroundColor: ('#F0A202'),
    borderColor: ('#0E1428'),
    borderWidth: 1,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 5,
    minHeight: '6%',
    flex: 0.4,
    justifyContent: 'space-around',
  },
  compose: {
    backgroundColor: '#0E1428',
    flex: 2.2,
    borderColor: '#F0A202',
    borderWidth: 1,
    maxWidth: '100%',
  },
  postarea: {
    flex: 7,
    backgroundColor: '#0E1428',
    borderColor: '#F0A202',
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 0,
    alignItems: 'stretch',
  },
  bottom: {
    backgroundColor: '#F0A202',
    flex: 0.2,
    alignItems: 'flex-start',
    margin: 5,
  },
  post: {
    backgroundColor: '#0E1428',
    borderWidth: 1,
    borderColor: '#F0A202',
    flexGrow: 1,
    borderRadius: 5,
    flex: 1,
    minWidth: '100%',
    maxWidth: '100',
    alignItems: 'stretch',

  },
  spacebook: {
    letterSpacing: 2,
    fontSize: 40,
    padding: 10,
    color: '#F0A202',
  },
  title: {
    letterSpacing: 2,
    fontSize: 25,
    padding: 1,
  },
  editbutton: {
    backgroundColor: '#F0A202',
    padding: 10,
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#F0A202',
    padding: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    maxWidth: '30%',
    alignItems: 'center',
    flex: 2,
    minHeight: '50%',
  },

  friendsbutton: {
    backgroundColor: '#F0A202',
    padding: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    maxWidth: '30%',
    alignItems: 'center',
    minHeight: '20%',
    paddingLeft: 70,
    paddingRight: 70,
    flexWrap: 'wrap',
  },

  postbar: {
    backgroundColor: '#0E1428',
    margin: 5,
    alignItems: 'flex-end',
  },

  photo: {
    flex: 2,
    borderWidth: 5,
    backgroundColor: 'grey',
    minWidth: '20%',
    maxWidth: '25%',
    minHeight: '100%',
  },

  input: {
    backgroundColor: '#0E1428',
    borderColor: '#F0A202',
    flex: 1,
    minHeight: '60%',
    color: 'white',
  },
  searchbar: {
    flex: 0.5,
    borderColor: '#F0A202',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
    left: 0,
    right: 0,
  },
  requests: {
    flex: 3,
    flexDirection: 'row',
    minWidth: '100%',
    borderColor: '#F0A202',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export const Text = styled.Text`
color: white;
font-size: 15px;
font-family: sans-serif;
text-align: center;
padding: 10px;
`;
