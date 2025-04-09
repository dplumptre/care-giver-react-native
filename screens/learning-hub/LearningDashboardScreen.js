import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import LearningVideoItem from "../../components/learning/LearningVideoItem";
import IconButton from "../../components/buttons/IconButton";
import axios from "axios";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

const LearningDashboardScreen =({navigation})=>{

    const [videoList,setVideo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const authCtx = useContext(authContext);


    useEffect(()=>{

        setIsLoading(true);
        const getVideos =()=>{
            axios.get(`${urlA}/videos`,{
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




        function onViewHandlerNow(id){
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
                        <IconButton name="bicycle" size={40} color="#FDE6D0" />
                    </Text>
                </View>
                <View style={styles.level}>
                <Text style={styles.statusTextMiddle}>Current Grade</Text>
                <Text style={styles.statusTextMiddle}>Beginner 101</Text>
                </View>
                <View >
                <Text style={styles.statusTextScore}>2/10</Text>
                <Text style={styles.statusText}>Level </Text>
                </View>

            </View>



    <View >
        <FlatList data={videoList} renderItem={itemData => {
          return(
              <LearningVideoItem text={itemData.item.title} id={itemData.item.id} onView={onViewHandlerNow}/>
          );
        }} 
        keyExtractor={(item,index)=> {return item.id;}} 
        alwaysBounceHorizontal={false} 
        scrollEnabled={true}  
        />
      </View>

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

