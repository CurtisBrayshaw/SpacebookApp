import { StylesContext } from "@material-ui/styles";
import { StyleSheet, View, Text, buttonText } from "react-native"
import { TouchableOpacity } from "react-native-web";
import styled from "styled-components/native";

   const StyledButton = props => {
    return(
   <TouchableOpacity onPress={props.onPress}>
     <View style={{...styles.button,...props.style}}> 
     <Text style={{...styles.buttonText, ...props.textStyling}}>
     {props.children}  
     </Text> 
     </View>
   </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
  button: {
    backgroundColor: ('#F0A202'),
    padding: 5,
    width:100,
    justifyContent: 'center',
    flexWrap:"wrap",
    flexDirection:"row"
  },
  buttonText: {
    backgroundColor: ('white'),
    
  },
});
export default StyledButton