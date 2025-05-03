import * as Notifications from 'expo-notifications';
import { Button } from 'react-native';
import { useEffect } from 'react';
import { View } from 'react-native';


const TestNotification = () => {


    useEffect(() => {
        Notifications.requestPermissionsAsync();
      }, []);
      
      const testNotification = async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "💊 Reminder!",
            body: "This is a test notification.",
          },
          trigger: {
            seconds: 5, // Fires after 5 seconds
          },
        });
      };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Test Notification" onPress={testNotification} />
    </View>
  );
};  

export default TestNotification;