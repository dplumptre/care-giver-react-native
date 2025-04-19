import { View, Text, StyleSheet, FlatList } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";


import { EXERCISE_SEGMENTS } from "../../data/dummy";
import SegmentGrid from "../../components/SegmentGrid";
import IconButton from "../../components/buttons/IconButton";

const ExerciseDashboardScreen = ({navigation}) => {


    const redirect =(itemData)=>{
        console.log(itemData.item.screen,itemData.item.id)
        navigation.navigate(itemData.item.screen,{myparams:itemData.item.id})
      }


    //   useFocusEffect(
    //     useCallback(() => {
    //       axios.get(`${urlA}/learning-hub-progress/user/result`, {
    //         headers: {
    //           Authorization: 'Bearer ' + authCtx.token,
    //         },
    //       })
    //       .then((response) => {
    //         setResult(response.data.data);
    //         console.log(response.data.data);
    //       })
    //       .catch((error) => {
    //         console.log("Error fetching result:", error.response?.data || error.message);
    //       });
    //     }, [authCtx.token])
    //   );



    function renderSegmentItem(itemData) {
        return <SegmentGrid
            title={itemData.item.title}
            icon={itemData.item.icon}
            id={itemData.item.id}
            color={itemData.item.color}
            redirect={ () =>redirect(itemData)}
        />
    }





    return (

        <View style={styles.mainContainer}>




            <View style={styles.statuses}>



                <View style={styles.statusTop}>
                    {/* Group Learning Hub and Bronze Level */}
                    <View style={styles.statusItem}>
                        <IconButton name="school" size={15} color="#FDE6D0" /> 
                        <Text style={styles.statusTextWhite}> Learning Hub:</Text>
                        <Text style={styles.statusTextDark}> Badge </Text>
                    </View>

                    {/* Group Medal Earned and Number */}
                    <View style={styles.statusItem}>
                        <IconButton name="medal-outline" size={15} color="#FFD700" />
                        <Text style={styles.statusTextWhite}> Earned: </Text>
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
                        <Text style={styles.statusTextWhite}> Earned: </Text>
                        <Text style={styles.statusTextDark}> 50 </Text>
                    </View>
                </View>

            </View>


            <View style={styles.greetings}>
                <Text style={styles.hello}>Select Role</Text>
            </View>


            <View style={styles.segments}>
                <FlatList data={EXERCISE_SEGMENTS} keyExtractor={(item) => item.id} renderItem={renderSegmentItem} numColumns={2} />
            </View>



        </View>
    )


}


export default ExerciseDashboardScreen;




const styles = StyleSheet.create({
    greetings: { flex: 0.50 ,  margin:12},
    hello: {
        color: '#522E2E',
        fontSize: 23
    },
    statuses: { 
        flex: 0.7 ,
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


    statusTextWhite: {
     
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

    

})