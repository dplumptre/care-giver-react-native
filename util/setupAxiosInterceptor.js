import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

export const setupAxiosInterceptor = (authCtx, navigationRef) => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            // If the response has a 401 status, handle it
            if (error.response && error.response.status === 401) {
                Alert.alert(
                    'Session Expired',
                    'Your session has expired. Please log in again.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                // Clear authentication context
                                authCtx.logout();

                                // Remove token from AsyncStorage
                                await AsyncStorage.removeItem('token');

                                // Navigate to the Logout screen
                                if (navigationRef.isReady()) {
                                    console.log('Navigation is ready. Navigating to Logout screen...');
                                    navigationRef.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'Logout' }], // Replace 'Logout' with your logout screen name
                                        })
                                    );
                                } else {
                                    console.log('Navigation is not ready.');
                                }
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }

            // Reject the promise with the error object
            return Promise.reject(error);
        }
    );
};