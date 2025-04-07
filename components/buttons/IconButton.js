import { Pressable,StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


const IconButton =({name,size,color, onPressHandler }) =>{
        return (
            <Pressable onPress={onPressHandler} style={({pressed})=> pressed && styles.pressed }>
                <Ionicons name={name} size={size} color={color} />
            </Pressable>
        )
}


export default IconButton;

const styles = StyleSheet.create({
    pressed:{
        opacity:0.7
    }
})