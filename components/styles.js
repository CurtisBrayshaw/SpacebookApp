import { StylesContext } from "@material-ui/styles";
import { StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-web";
import styled from "styled-components/native";

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
          backgroundColor: ('#0E1428'),
          flex:1,
          alignContent:"flex-start"
        },
        title:{
          backgroundColor: '#D95D39',
            letterSpacing: 2,
            fontSize:40,
            justifyContent:'center'
          },
        editbutton: {
          backgroundColor: ('#F0A202'),
          padding: 10,
          width:100,
          alignItems: 'flex-end',
          justifyContent: 'center'
        },
        button: {
          backgroundColor: ('#F0A202'),
          padding: 5,
          width:100,
          justifyContent: 'center',
          flexWrap:"wrap",
          flexDirection:"row"
        },
        posts: {
          backgroundColor: ('#0E1428'),
          margin: 5,
          padding: 0,
          alignItems: 'flex-start',
          borderWidth:1,
          borderColor: '#F0A202'
        },
        user: {
          backgroundColor: ('#0E1428'),
          padding: 0,
          alignItems: 'flex-start',
        },
        topper: {
          backgroundColor: ('#0E1428'),
          padding: 0,
          alignItems: 'flex-start',
        },
    
 })

export const Text = styled.Text`
color: white;
font-size: 15px;
font-family: sans-serif;
text-align: center;
`