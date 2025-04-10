import { View, Text, StyleSheet, FlatList } from "react-native";
import {SEGMENTS} from '../data/dummy';
import SegmentGrid from '../components/SegmentGrid';
import IconButton from '../components/buttons/IconButton';
import { useContext, useEffect, useState } from "react";
import { authContext } from "../store/auth-context";
import axios from "axios";
import { urlA } from "../constant/konst";

const DashboardScreen = () => {

    const [name,setName] = useState('');



    const authCtx = useContext(authContext);


    useEffect(() => {
        axios.get(`${urlA}/auth/user`, {
          headers: {
            Authorization: 'Bearer ' + authCtx.token,
          },
        })
        .then((response) => {
          setName(response.data.name);
        })
        .catch((error) => {
          console.log("Error fetching user:", error.response?.data || error.message);
        });
      }, []);

    function renderSegmentItem(itemData) {
        return <SegmentGrid
            title={itemData.item.title}
            icon={itemData.item.icon}
            id={itemData.item.id}
            color={itemData.item.color}
            screen={itemData.item.screen}
        />
    }





    return (

        <View style={styles.mainContainer}>

            <View style={styles.greetings}>
                <Text style={styles.hello}>Hello {name},</Text>
                <Text style={styles.tagline}>Ready to level up your care skills?</Text>
            </View>


            <View style={styles.statuses}>



                <View style={styles.statusTop}>
                    {/* Group Learning Hub and Bronze Level */}
                    <View style={styles.statusItem}>
                        <IconButton name="school" size={15} color="#FDE6D0" /> 
                        <Text style={styles.statusTextWhite}> Learning Hub:</Text>
                        <Text style={styles.statusTextDark}> Bronze Level</Text>
                    </View>

                    {/* Group Medal Earned and Number */}
                    <View style={styles.statusItem}>
                        <IconButton name="medal-outline" size={15} color="#FFD700" />
                        <Text style={styles.statusTextWhite}> Medal Earned: </Text>
                        <Text style={styles.statusTextDark}> 50 </Text>
                    </View>
                </View>
                <View style={styles.statusTop}>
                    {/* Group Learning Hub and Bronze Level */}
                    <View style={styles.statusItem}>
                        <IconButton name="home" size={15} color="#FDE6D0" /> 
                        <Text style={styles.statusTextWhite}> Home Setup:</Text>
                        <Text style={styles.statusTextDark}>  Uncompleted</Text>
                    </View>

                    {/* Group Medal Earned and Number */}
                    <View style={styles.statusItem}>
                        <IconButton name="medal-outline" size={15} color="#FFD700" />
                        <Text style={styles.statusTextWhite}> Medal Earned: </Text>
                        <Text style={styles.statusTextDark}> 50 </Text>
                    </View>
                </View>



                <View style={styles.statusDown}>

                    <View style={styles.statusItemDown}>
                        <IconButton name="videocam" size={15} color="#FDE6D0" />
                        <Text style={styles.statusTextWhite}> Next Video: What is Stroke?</Text>
                    </View>
                 
                    <View style={styles.statusItem}>
                        <IconButton name="body" size={15} color="#FDE6D0"/>
                        <Text style={styles.statusTextWhite}> Next Excercise</Text>
                    </View>

                </View>

            </View>



            <View style={styles.segments}>
                <FlatList data={SEGMENTS} keyExtractor={(item) => item.id} renderItem={renderSegmentItem} numColumns={2} />
            </View>



        </View>
    )


}


export default DashboardScreen;




const styles = StyleSheet.create({
    greetings: { flex: 0.50 ,  margin:12},
    hello: {
        color: '#522E2E'
    },
    tagline: {
        color: '#522E2E',
        fontSize: 23,
        fontWeight: 'bold'
    },
    statuses: { 
        flex: 1.5 ,
        backgroundColor:'#C57575',
        padding:10,
        borderRadius:6,
        margin:12,
  

    },
    statusTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  
        paddingVertical: 5, 
    },
    statusItemDown:{

        flexDirection: 'row',
        alignItems: 'center', 
        paddingVertical: 5, 
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center', 
    },


    statusTextWhite: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFFFFF',  
    },
    statusTextDark: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#2D1E1E', 
    },
    segments: { flex: 6 },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
    },

    

})