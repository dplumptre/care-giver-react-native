import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useContext,useEffect,useLayoutEffect,useState } from "react";
import { View,StyleSheet } from "react-native";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import ExerciseItem from "../../components/ExerciseItem";
import { FlatList } from "react-native-gesture-handler";

const ExerciseListScreen = ({ navigation,route }) => {

    const { myparams } = route.params;
    const authCtx = useContext(authContext);
    const [videoList, setVideo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        setIsLoading(true);
        const getVideos = () => {
            axios.get(`${urlA}/videos?type=${myparams}`, {
                headers: {
                    Authorization: 'Bearer ' + authCtx.token
                }
            }).then(response => {
                const data = response.data.data;
                console.log(data);
                setVideo(data);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            })
        }
        getVideos();
    }, []);

    useLayoutEffect(() => {
        const formatTitle = (title) => {
          return title
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
        };
      
        navigation.setOptions({
          title: formatTitle(myparams)
        });
      }, [navigation, myparams]);


    function onViewHandler(id){
        console.log(id);
        navigation.navigate('ExerciseVideoDetail',{videoId:id})
    }


    if (isLoading) {
        return <LoadingOverlay message="Loading videos..." />;
    }


    return <View style={styles.container}>
        <FlatList
            data={videoList}
            renderItem={itemData => (
                <ExerciseItem
                    text={itemData.item.title}
                    exerciseId={itemData.item.id}
                    onView={onViewHandler}
                />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            style={{ flex: 1 }}
        />
    </View>


}

export default ExerciseListScreen;




const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        marginHorizontal: 12,

    },

    icon: {},
    statusTextMiddle: {
        color: 'white',
        fontSize: 20,

    },
    statusText: {
        color: 'white',
        textAlign: 'center'

    },
    statusTextScore: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold'
    },

});

