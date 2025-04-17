import {  createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const authContext = createContext(
    {
        token:'',
        isAuthenticated: false,
        authenticate: (token)=>{},
        logout :()=>{}
    }
);




const AuthContextProvider =({children})=>{

    const [authToken,setAuthToken] = useState();


    function authenticate(token){
        setAuthToken(token)
        AsyncStorage.setItem('token',token);
    }

    function logout(){
        setAuthToken(null)
    }

    const value ={
        token: authToken,
        isAuthenticated: !! authToken,
        authenticate: authenticate,
        logout : logout
    }

    return <authContext.Provider value={value}>{children}</authContext.Provider>
}


export default AuthContextProvider;