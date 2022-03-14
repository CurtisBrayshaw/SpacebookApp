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
          letterSpacing: 2,
          fontSize:25,
          justifyContent:'center'
          },
        editbutton: {
          backgroundColor: ('#F0A202'),
          padding: 10,
          width:50,
          alignItems: 'flex-end',
          justifyContent: 'center'
        },
        button: {
          backgroundColor: ('#F0A202'),
          padding: 5,
          justifyContent: 'center',
          flexDirection:'row',
          borderRadius:5
        },
        postarea:{
          flex:7,
          backgroundColor: ('#0E1428'),  
          borderColor: '#F0A202',
          borderWidth:1,
          margin: 5,
        },
        post: {
          backgroundColor: ('#0E1428'),
          margin: 5,
          alignItems: 'flex-start',
          borderWidth:1,
          borderColor: '#F0A202',
          flexGrow:1,
          borderRadius:5,
          flex:1
        },
        postbar: {
          flex:7,
          backgroundColor: ('#0E1428'),  
          borderColor: '#F0A202',
          borderWidth:1,
          margin: 5,
          alignItems:'stretch',
          flex:1
        },
        user: {
          backgroundColor: ('#3285a8'),
          flexWrap:'wrap',
          
        },
        input: {
          backgroundColor: ('#0E1428'),
          borderColor: ('#0E1428'),
          flex:2,
        },
        topper: {
          backgroundColor: ('#0E1428'),
          padding: 0,
          alignItems: 'flex-start',
        },
        navbar: {
          backgroundColor: ('#F0A202'),
          padding: 5,
          justifyContent: 'center',
          flexDirection:'row',
          borderRadius:5,
          flex:0.4,
          justifyContent:"space-around",
        },
        
    
 });


export const Text = styled.Text`
color: white;
font-size: 15px;
font-family: sans-serif;
text-align: center;
`