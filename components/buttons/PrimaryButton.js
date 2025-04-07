
import {View,Text,Pressable,StyleSheet} from 'react-native';


function PrimaryButton({children, onPress}){



    return (<View style={styles.buttonOutterContainer}>
        <Pressable  style={styles.buttonInnerContainer} onPress={onPress} android_ripple={{color:'#4C2929'}}>
        <Text style={styles.buttonText}>{children}</Text>
        </Pressable>  
  </View>)
}

export default PrimaryButton;


const styles = StyleSheet.create({
    buttonOutterContainer:{
        margin:4,
        overflow:'hidden',
        borderRadius:6
    },
buttonInnerContainer:{
    backgroundColor:'#522E2E',
    paddingVertical:14,
    paddingHorizontal:16,
    elevation:2,
},
buttonText:{
    color:'white',
    textAlign:'center'

}

})