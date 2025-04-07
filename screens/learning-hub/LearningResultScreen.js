import { Text,StyleSheet,View } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import IconButton from "../../components/buttons/IconButton";


const LearningResultScreen =()=>{

    return (<View style={styles.container}>
      <IconButton name='gift' color='#B8860B' size={80} />
<Text style={styles.congrats}>Congratulations</Text>
<Text style={styles.content}>You had a perfect score, you can move to the next video</Text>
<PrimaryButton>Back to  Learning Hub</PrimaryButton>
</View>
)

}

export default LearningResultScreen;




const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:12,
    },
    congrats:{
        fontSize:30,
        fontWeight:'bold',
        color:'#522E2E',
        marginVertical:20,   
    },
    content:{
        marginVertical:20,   
    }
  });