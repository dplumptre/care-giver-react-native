import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import DashboardScreen from './screens/DashboardScreen';
import ResetScreen from './screens/auth/ResetScreen';
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
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import LogoutScreen from './screens/auth/LogoutScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import IconButton from './components/buttons/IconButton';
import PatientScreen from './screens/patient/PatientScreen';
import AddPatientScreen from './screens/patient/AddPatientScreen';
import EditPatientScreen from './screens/patient/EditPatientScreen';
import ExerciseDashboardScreen from './screens/exercices/ExerciseDashboardScreen';
import ExerciseListScreen from './screens/exercices/ExerciseListScreen';
import ExerciseVideoDetailScreen from './screens/exercices/ExerciseVideoDetailScreen';
import ExerciseResultScreen from './screens/exercices/ExerciseResultScreen';
import HomeSetupDashboardScreen from './screens/home-setup/HomeSetupDashboardScreen';
import HomeSetupCheckListScreen from './screens/home-setup/HomeSetupCheckListScreen';
import HomeSetupResultScreen from './screens/home-setup/HomeSetupResultScreen';
import MedicationDashboardScreen from './screens/medication/MedicationDashboardScreen';
import AddMedicationScreen from './screens/medication/AddMedicationScreen';
import EditMedicationScreen from './screens/medication/EditMedicationScreen';
import TestNotification from './components/TestNotification';
import { registerNotificationActions } from './util/notificationHelper';
import * as Notifications from 'expo-notifications';
import { MedicationActions } from './util/enum';
import axios from 'axios';
import { urlA } from './constant/konst';
import { setupAxiosInterceptor } from './util/setupAxiosInterceptor';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const navigationRef = createNavigationContainerRef();




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
            onPressHandler={
              () => {navigation.toggleDrawer()
            }}
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
            onPressHandler={
              () => {navigation.toggleDrawer()
            }}
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


function ExerciseNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#522E2E',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="ExerciseDashboard"
        component={ExerciseDashboardScreen}
        options={{
          title: 'Rehabilitation Exercise',
          headerLeft: () => (
            <IconButton
            name="menu"
            color="#522E2E"
            size={23}
            onPressHandler={
              () => {navigation.toggleDrawer()
            }}
          />
        
          )
        }}


      />
        <Stack.Screen
        name="ExerciseList"
        component={ExerciseListScreen}
        options={{ title: 'Exercises' }}
      />
        <Stack.Screen
        name="ExerciseVideoDetail"
        component={ExerciseVideoDetailScreen}
        options={{ title: 'Exercises' }}
      />
      <Stack.Screen
        name="ExerciseResult"
        component={ExerciseResultScreen}
        options={{ title: 'Result' }}
      />
    </Stack.Navigator>
  );
}

function PatientNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#522E2E',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="PatientDashboard"
        component={PatientScreen}
        options={{
          title: 'Patients',
          headerLeft: () => (
            <IconButton
            name="menu"
            color="#522E2E"
            size={23}
            onPressHandler={
              () => {navigation.toggleDrawer()
            }}
          />
          
          )
        }}
      />
        <Stack.Screen
        name="AddPatient"
        component={AddPatientScreen}
        options={{ title: 'Add Patient' }}
      />
      <Stack.Screen
        name="EditPatient"
        component={EditPatientScreen}
        options={{ title: 'Edit Patient' }}
      />
    </Stack.Navigator>
  );
}




function MedicationNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#522E2E',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="MedicationDashboard"
        component={MedicationDashboardScreen}
        options={{
          title: 'Medication Tracker',
          headerLeft: () => (
            <IconButton
            name="menu"
            color="#522E2E"
            size={23}
            onPressHandler={
              () => {navigation.toggleDrawer()
            }}
          />
          
          )
        }}
      />
        <Stack.Screen
        name="AddMedication"
        component={AddMedicationScreen}
        options={{ title: 'Add Medication' }}
      />
      <Stack.Screen
        name="EditMedication"
        component={EditMedicationScreen}
        options={{ title: 'Edit Medication' }}
      />
    </Stack.Navigator>
  );
}





function HomeSetupNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#522E2E',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="HomeSetupDashboard"
        component={HomeSetupDashboardScreen}
        options={{
          title: 'Personalised Home Setup',
          headerLeft: () => (
            <IconButton
            name="menu"
            color="#522E2E"
            size={23}
            onPressHandler={
              () => {navigation.toggleDrawer()
            }}
          />
          
          )
        }}
      />
        <Stack.Screen
        name="HomeSetupCheckList"
        component={HomeSetupCheckListScreen}
        options={{ title: 'Home Setup Check List' }}
      />
      <Stack.Screen
        name="HomeSetupResult"
        component={HomeSetupResultScreen}
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
    headerTitleAlign: 'center',
  
}}>
       <Drawer.Screen name='Dashboard' component={MainDashboardNavigator} 
        options={{
          title:'Dashboard',
          drawerIcon:({color,size}) =>(
            <Ionicons name="stats-chart" size={size} color={color}  />
          )
        }}
    />

<Drawer.Screen name='HomeSetupModule' component={HomeSetupNavigator} 
        options={{
          title:"Personalised Home Setup",
          drawerIcon:({color,size}) =>(
            <Ionicons name="home" size={size} color={color} />
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

<Drawer.Screen name='MedicationModule' component={MedicationNavigator} 
        options={{
          title:"Medication Tracker",
          drawerIcon:({color,size}) =>(
            <Ionicons name="medical" size={size} color={color} />
          )
        }}
    />
<Drawer.Screen name='ExerciseModule' component={ExerciseNavigator} 
        options={{
          title:"Rehabilitation Exercise",
          drawerIcon:({color,size}) =>(
            <Ionicons name="bicycle" size={size} color={color} />
          )
        }}
    />



<Drawer.Screen name='PatientModule' component={PatientNavigator} 
        options={{
          title:"Patients",
         
          drawerIcon:({color,size}) =>(
            <Ionicons name="person" size={size} color={color} />
          )
        }}
    />
    

<Drawer.Screen
  name="Logout"
  component={LogoutScreen}
  options={{
    title: 'Logout',
    drawerIcon: ({ color, size }) => (
      <Ionicons name="log-out" size={size} color={color} />
    ),
  }}
/>


<Drawer.Screen name='NotificationModule' component={TestNotification} 
        options={{
          title:"Test Notification",
          drawerIcon:({color,size}) =>(
            <Ionicons name="notifications" size={size} color={color} />
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
    <NavigationContainer ref={navigationRef}>
      {authCtx.isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}



function Root() {
  const [isTryingLogin, setIsTrying] = useState(true);
  const authCtx = useContext(authContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.setAuthToken(storedToken); 
      }
      setIsTrying(false);
    }
    fetchToken();
  }, []);

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


  const authCtx = useContext(authContext);

  useEffect(() => {
    // Set up the Axios interceptor
    setupAxiosInterceptor(authCtx, navigationRef);
  }, [authCtx]);

  useEffect(() => {
    // Register notification actions
    registerNotificationActions();


    // Add listener for notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const action = response.actionIdentifier;
      const data = response.notification.request.content.data;

      console.log('Action:', action);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('Token not found. Unable to process notification action.');
        return;
      }

      if (action === MedicationActions.TAKE) {
        console.log('Medication marked as taken', data);
      } else if (action === MedicationActions.SKIP) {
        console.log('Medication marked as skipped', data);
        Alert.alert("Medication marked as skipped", "You have successfully skipped this medication.");

      } else {
        console.error("payload:", payload);
        console.log('Notification tapped without action button', data);
        return;
      }


      payload = {
        action: action,
        scheduledFor: data.isoDate,
        patientId: data.patientId,
      };

      try {
        const resp = await axios.post(
          `${urlA}/medications/add-medication-log`,
          payload,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const result = resp.data;
        console.log("Notification Log created:", result);
        Alert.alert("Log Created", "You have successfully logged this medication.");
      } catch (error) {
        Alert.alert("Error", "Failed to log medication.");
        console.log("Error creating notification log:", payload);
        console.log("Failed to log medication:", error.response?.status, error.response?.data || error.message);
      }

    });


    // Clean up the listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);


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
