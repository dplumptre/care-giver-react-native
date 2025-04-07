import { Text,View,StyleSheet } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";

const LearningVideoDetailScreen =()=>{

    return (
    
<View style={styles.container}>
    <View style={styles.video}>
        <Text>Text</Text>
    </View>

    <View style={styles.content}>
        <Text style={styles.contentText}> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here',</Text>
        <PrimaryButton> Start Quiz</PrimaryButton>
    </View>
</View>
    

)

}

export default LearningVideoDetailScreen;


const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        marginHorizontal:12,
    },
    video:{
        flex: 6,
   
    },
    content:{
        flex:4,

    },
    contentText:{
        marginVertical:16,
    }
  });