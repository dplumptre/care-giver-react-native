import { Pressable,View,Text,StyleSheet, Platform } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";


function SegmentGrid({id,title,icon,color,redirect}) {

const navigation = useNavigation();





    return(
        <View style={styles.gridItem}>
          
  <Pressable 
    android_ripple={{ color: '#E0E0E0' }} // Softer ripple effect for Android
    style={({ pressed }) => [
        styles.button,
      Platform.OS === 'ios' && pressed ? styles.pressedItem : null
    ]}
    onPress={redirect}
  >
                   <View style={styles.innerContainer}>
                   <Text style={styles.icon}>
                   <FontAwesome5 name={icon} size={24} color={color} />
                   </Text>
                    <Text style={styles.title}>{title}</Text>
                    </View>
            </Pressable>
        </View>
    )
}

export default SegmentGrid;


const styles= StyleSheet.create({
    gridItem:{
        flex:1,
        margin:12,
        height:150,
        width: 150,
        borderRadius:8,
        elevation:4,

        backgroundColor:'white',
        shadowColor:'black',
        shadowOpacity:0.25,
        shadowOffset:{width:0, height:2},
        shadowRadius:8,
        overflow: Platform.OS === 'android' ?  'hidden' : 'visible'


    },
    button:{
        flex:1
    },
    innerContainer:{
        flex:1,
        padding: 16,
        justifyContent: 'center',
        alignItems:'center'
    },
    icon:{
        alignItems:'center'
    },
    pressedItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light grey on press (for iOS)
      },
    title:{
        fontSize: 15,
        marginTop:10,

    }
})