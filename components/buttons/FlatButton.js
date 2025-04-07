
import {View,Text,Pressable,StyleSheet} from 'react-native';


function FlatButton({children, onPress, position="center"}){



    return (<View style={styles.buttonOutterContainer}>
        <Pressable  style={styles.buttonInnerContainer} onPress={onPress} >
        <Text style={[styles.buttonText, { textAlign: position }]}>{children}</Text>
        </Pressable>  
  </View>)
}

export default FlatButton;


const styles = StyleSheet.create({
    buttonOutterContainer:{
        margin:2
    },
buttonInnerContainer:{

},
buttonText:{
    color:'#522E2E',

}

})