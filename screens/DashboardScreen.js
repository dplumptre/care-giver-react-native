import { View, Text, StyleSheet, FlatList } from "react-native";
import {SEGMENTS} from '../data/dummy';
import SegmentGrid from '../components/SegmentGrid';
import IconButton from '../components/buttons/IconButton';
import { useCallback, useContext, useEffect, useState } from "react";
import { authContext } from "../store/auth-context";
import axios from "axios";
import { urlA } from "../constant/konst";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
const DashboardScreen = ({navigation}) => {


    const redirect =(screen)=>{
        navigation.navigate(screen)
      }


    const [name,setName] = useState('');
    const [result,setResult]= useState({
        "currentLevel": 0,
        "reward": "Unranked",
        "levels": 0
      })



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
      }, [authCtx.token]);




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



    function renderSegmentItem(itemData) {
        return <SegmentGrid
            title={itemData.item.title}
            icon={itemData.item.icon}
            id={itemData.item.id}
            color={itemData.item.color}
            redirect={ () =>redirect(itemData.item.screen)     }
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
                        <Text style={styles.statusTextYellow}> {result.reward ? `${result.reward} Badge` : "Loading..."} </Text>
                    </View>

                    {/* Group Medal Earned and Number */}
                    <View style={styles.statusItem}>
                        <FontAwesome5 name="star" size={14} color="#FFD700"  />
                        <Text style={styles.statusTextWhite}> Carer: </Text>
                        <Text style={styles.statusTextYellow}> 10 </Text>
                    </View>
                </View>
                <View style={styles.statusTop}>
                    {/* Group Learning Hub and Bronze Level */}
                    <View style={styles.statusItem}>
                        <IconButton name="home" size={15} color="#FDE6D0" /> 
                        <Text style={styles.statusTextWhite}> Home Setup stars:</Text>
                        <Text style={styles.statusTextYellow}>  50</Text>
                    </View>

                    {/* Group Medal Earned and Number */}
                    <View style={styles.statusItem}>
                    <FontAwesome5 name="star" size={14} color="#FFD700"  />
                        <Text style={styles.statusTextWhite}> Patient: </Text>
                        <Text style={styles.statusTextYellow}> 50 </Text>
                    </View>
                </View>



                <View style={styles.statusDown}>

                    <View style={styles.statusItemDown}>
                        <FontAwesome5 name="briefcase-medical" size={14} color="#FDE6D0"  />
                        <Text style={styles.statusTextWhite}> Medical Adherance:</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <FontAwesome5 name="award" size={14} color="#FFFACD"  />
                        <Text style={styles.statusTextYellow}> Next Excercise </Text>
                        <FontAwesome5 name="star" size={14} color="#FFD700"  />
                        <Text style={styles.statusTextYellow}> 50 </Text>
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
        color: '#522E2E',
        fontSize: 17
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
        fontSize: 18,
  

    },
    statusTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  
    },
    statusItemDown:{

        flexDirection: 'row',
        alignItems: 'center', 
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center', 
    },

    statusItemIndent: {
        flexDirection: 'row',
        alignItems: 'flex-end', 
    },


    statusTextWhite: {
        fontWeight: 'bold',
        paddingVertical: 5,
        color: '#FFFFFF',  
    },
    statusTextDark: {
        paddingVertical: 5,
        color: '#000', 
         fontWeight: 'bold'
    },
    segments: { flex: 6 },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
    },   
    statusTextYellow: {
        color: '#FFFACD',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusTextYellowAndIndent: {
        color: '#FFFACD',
        fontWeight: 'bold',
        fontSize: 14,
        paddingLeft: 10,
    }

    

})