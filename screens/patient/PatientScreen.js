import PatientItem from "../../components/PatientItem";
import {  View, StyleSheet, FlatList } from "react-native";
import {  useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import IconButton from "../../components/buttons/IconButton";
import { useFocusEffect } from "@react-navigation/native";

const PatientScreen =({navigation})=>{


    const [patientList,setPatientList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const authCtx = useContext(authContext);


    function headerButtonPressHandler(){
        navigation.navigate("AddPatient")
    }
    
      useLayoutEffect(()=>{
        navigation.setOptions({
                headerRight: ()=>{
                  return <IconButton onPressHandler={headerButtonPressHandler} name="person-add" size={24} color="#522E2E" />
                }
              })
    },[navigation,headerButtonPressHandler])


    useFocusEffect(
      useCallback(() => {
            console.log("starts..."+authCtx.token)
            console.log(`${urlA}/patients`)
        setIsLoading(true);
        const getPatients =()=>{
            axios.get(`${urlA}/patients`,{
                headers:{
                    Authorization: 'Bearer '+ authCtx.token
                }
            }).then(response => {
                const data = response.data.data;
                console.log(response.data);
                console.log(data);
                setPatientList(data);
            }).catch((error)=>{
                console.log(error);
            }).finally(()=>{
                setIsLoading(false);
            })
        } 
        getPatients();
      }, [authCtx.token])
    );








    function onViewHandler(id){
        console.log(id);
        navigation.navigate('EditPatient',{patientId:id})
    }

    if (isLoading) {
        return <LoadingOverlay message="Loading Patients..." />;
      }

return(
<View style={styles.container}>
    <FlatList
      data={patientList}
      renderItem={itemData => (
        <PatientItem
          text={itemData.item.name}
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


export default PatientScreen;





const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        marginHorizontal:12,
   
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

