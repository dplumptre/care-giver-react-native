import * as Notifications from 'expo-notifications';
import { Button, Platform, View, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { scheduleMedicationNotifications } from '../util/notificationHelper';

const TestNotification = () => {
  const [date, setDate] = useState('2025-05-04T00:09:00.000Z');
  const [drugName, setDrugName] = useState('Medication'); // Add drug name for testing
  
  useEffect(() => {
    Notifications.requestPermissionsAsync();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

  const testNotification = async () => {
    // Parse the manually entered date
    const customDate = new Date(date);

    if (isNaN(customDate)) {
      console.log('Invalid date format');
      return;
    }

    // Pass the date to your scheduleMedicationNotifications function
    // Assuming your timeCards is an array of objects with the isoDate in the correct format
    const timeCards = [{ isoDate: customDate.toISOString() }];
    await scheduleMedicationNotifications(drugName, timeCards);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Input for the user to manually enter a date */}
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, width: 250, textAlign: 'center' }}
        value={date}
        onChangeText={(text) => setDate(text)}
        placeholder="Enter date (e.g., 2025-05-03T22:41:00.000Z)"
      />
      <Button title="Test Notification" onPress={testNotification} />
    </View>
  );
};

export default TestNotification;
