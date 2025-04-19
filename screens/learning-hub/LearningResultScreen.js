import { Text,StyleSheet,View } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import IconButton from "../../components/buttons/IconButton";


const LearningResultScreen =({route, navigation})=>{

    const {score,isSuccessful} = route.params;


    const onRedirect =()=>{
        navigation.navigate('LearningDashboard');
    }

    if(isSuccessful){

        return (<View style={styles.container}>
            <IconButton name='gift' color='#B8860B' size={80} />
      <Text style={styles.congrats}>Congratulations</Text>
      <Text style={styles.content}>You had a perfect score, you can move to the next video</Text>
      <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={onRedirect}>Back to  Learning Hub</PrimaryButton>
      </View>
      )

    }

    return (
        <View style={styles.container}>
          <IconButton name='sad' color='#B8860B' size={80} />
          <Text style={styles.congrats}>Keep Going!</Text>
      
          {score >= 0.75 ? (
            <Text style={styles.content}>
               You scored {Math.round(score * 100)}%. So close! Review the video and try again to earn your badge.
            </Text>
          ) : score >= 0.5 ? (
            <Text style={styles.content}>
              You scored {Math.round(score * 100)}%. You're about halfway there! Go through the video once more and give it another shot.
            </Text>
          ) : (
            <Text style={styles.content}>
               You scored {Math.round(score * 100)}%.Don't give up! Rewatch the video and try again to improve your score.
            </Text>
          )}
      
      <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={onRedirect}>Back to Learning Hub</PrimaryButton>
        </View>
      );

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
        fontSize:16
    }
  });