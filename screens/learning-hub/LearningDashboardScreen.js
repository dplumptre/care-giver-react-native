import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import LearningVideoItem from "../../components/learning/LearningVideoItem";
import IconButton from "../../components/buttons/IconButton";
import axios from "axios";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { useFocusEffect } from "@react-navigation/native";
import { VideoType } from "../../util/enum";



const LearningDashboardScreen =({navigation})=>{

    const [videoList,setVideo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const authCtx = useContext(authContext);
    const [result,setResult]= useState({
        "currentLevel": 0,
        "reward": "Unranked",
        "levels": 0
      })


    useEffect(()=>{

        setIsLoading(true);
        const getVideos =()=>{
            axios.get(`${urlA}/videos?type=${VideoType.LEARNING_HUB}`,{
                headers:{
                    Authorization: 'Bearer '+ authCtx.token
                }
            }).then(response => {
                const data = response.data.data;
                console.log(data);
                setVideo(data);
            }).catch((error)=>{
                console.log(error);
            }).finally(()=>{
                setIsLoading(false);
            })
        } 
        getVideos();
    },[]);


    useFocusEffect(
        useCallback(() => {
          axios.get(`${urlA}/learning-hub-progress/user/result`, {
            headers: {
              Authorization: 'Bearer ' + authCtx.token,
            },
          })
          .then((response) => {
            setResult(response.data.data);
            console.log(response.data.data);
          })
          .catch((error) => {
            console.log("Error fetching result:", error.response?.data || error.message);
          });
        }, [authCtx.token])
      );



    function onViewHandler(id){
        console.log(id);
        navigation.navigate('LearningVideoDetail',{videoId:id})
    }

    if (isLoading) {
        return <LoadingOverlay message="Loading videos..." />;
      }

    return (
       


      <View style={styles.container}>
      <View style={styles.status}>
                <View style={styles.icon}>
                    <Text>
                        <IconButton name="school" size={40} color="#FDE6D0" />
                    </Text>
                </View>
                <View style={styles.level}>
                <Text style={styles.statusTextMiddle}>Current Badge</Text>
                <Text style={styles.statusTextMiddle}>{ result.reward ? `${result.reward}` : "Loading..."}</Text>
                </View>
                <View >
                <Text style={styles.statusTextScore}>{result.reward ? `${result.currentLevel}/ ${result.levels}` : "Loading..."}</Text>
                <Text style={styles.statusText}>Level</Text>
                </View>

            </View>

  <FlatList
    data={videoList}
    renderItem={itemData => (
      <LearningVideoItem
        text={itemData.item.title}
        id={itemData.item.id}
        onView={onViewHandler}
      />
    )}
    keyExtractor={(item) => item.id}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 16 }}
    style={{ flex: 1 }}
  />
</View>






    )
}

export default LearningDashboardScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        marginHorizontal:12,
   
    },
    status:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#C57575',
        padding:10,
        borderRadius:6,
        alignItems:'center',
        marginBottom:30,


        borderWidth: 1,
        borderColor: '#DDD',
    
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,

    },
    icon:{},
    statusTextMiddle:{
        color:'white',
        fontSize:20,

    },
    statusText:{
        color:'white',
        textAlign:'center'

    },
    statusTextScore:{
        color:'white',
        fontSize:36,
        fontWeight:'bold'
    },
   
});

