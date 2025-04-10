import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DashboardScreen from './screens/DashboardScreen';
import ResetScreen from './screens/auth/ResetScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LearningResultScreen from './screens/learning-hub/LearningResultScreen';
import LearningVideoDetailScreen from './screens/learning-hub/LearningVideoDetailScreen';
import LearningVideoQuestionsScreen from './screens/learning-hub/LearningVideoQuestionsScreen';
import LearningDashboardScreen from './screens/learning-hub/LearningDashboardScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import SignupScreen from './screens/auth/SignupScreen';
import SigninScreen from './screens/auth/SigninScreen';
import AuthContextProvider,{authContext} from './store/auth-context';
import { useContext, useEffect, useState } from 'react';
import LogoutScreen from './screens/auth/LogoutScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import IconButton from './components/buttons/IconButton';




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();





function MainDashboardNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#522E2E',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="MainDashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerLeft: () => (
            <IconButton
            name="menu"
            color="#522E2E"
            size={23}
            drawer
          />
          
          )
        }}
      />
    </Stack.Navigator>
  );
}


function LearningHubNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#522E2E',
      }}
    >
      <Stack.Screen
        name="LearningDashboard"
        component={LearningDashboardScreen}
        options={{
          headerShown: true,
          title: 'Learning Hub',
          headerLeft: () => (
            <IconButton
            name="menu"
            color="#522E2E"
            size={23}
            drawer
          />
          
          )
        }}
      />
      <Stack.Screen
        name="LearningVideoDetail"
        component={LearningVideoDetailScreen}
        options={{ title: 'Video Detail' }}
      />
      <Stack.Screen
        name="LearningVideoQuestions"
        component={LearningVideoQuestionsScreen}
        options={{ title: 'Video Quiz' }}
      />
      <Stack.Screen
        name="LearningResult"
        component={LearningResultScreen}
        options={{ title: 'Result' }}
      />
    </Stack.Navigator>
  );
}



const DrawerNavigator=()=>{
  return <Drawer.Navigator     
  screenOptions={{
    headerStyle:{backgroundColor:'#FFF'},
    headerTintColor:'#522E2E',
    drawerContentStyle:{backgroundColor:'#FFF'},
    drawerActiveBackgroundColor:'#C57575',
    drawerActiveTintColor:'#FFF',
    drawerInactiveTintColor:'#522E2E',
    drawerItemStyle: { borderRadius: 5 },
    headerShown: false,
    gestureEnabled: true, 
    swipeEdgeWidth: 100, 
  
}}>
       <Drawer.Screen name='Dashboard' component={MainDashboardNavigator} 
        options={{
          title:'Dashboard',
          drawerIcon:({color,size}) =>(
            <Ionicons name="stats-chart" size={size} color={color} />
          )
        }}
    />
   <Drawer.Screen name='LearningHub' component={LearningHubNavigator} 
        options={{
          title:"Learning Hub",
         
          drawerIcon:({color,size}) =>(
            <Ionicons name="school" size={size} color={color} />
          )
        }}
    />
       <Drawer.Screen name='Logout' component={LogoutScreen} 
        options={{
          title:"Logout",
          drawerIcon:({color,size}) =>(
            <Ionicons name="exit" size={size} color={color} />
          )
        }}
    />
  </Drawer.Navigator>
}




function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#522E2E',
      }}
    >
      <Stack.Screen name="Signin" component={SigninScreen} options={{ title: 'Welcome back Caregiver' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Join Care Hub Today" }} />
      <Stack.Screen name="Reset" component={ResetScreen} options={{ title: "Regain Access To Your Account" }} />
    </Stack.Navigator>
  );
}




function Navigation() {
  const authCtx = useContext(authContext);

  return (
    <NavigationContainer>
      {authCtx.isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}



function Root(){
  const [isTryingLogin,setIsTrying] = useState(true)
  const authCtx = useContext(authContext);
  useEffect(()=>{
        
    async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('token');

        if(storedToken){
            setAuthToken(storedToken);
        }

        setIsTrying(false)
   }
   fetchToken();
},[]);


if (isTryingLogin) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#C57575" />
    </View>
  );
}


return <Navigation />;
}





export default function App() {









  return (
    <AuthContextProvider>
      <StatusBar style="auto" />
      <Root />
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
