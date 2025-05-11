import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { MedicationActions } from './enum';

// Ensure notification handler is set once (typically on app startup)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Setup Android notification channel once
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500],
    lightColor: '#FF231F7C',
  });
}

// Custom hook to get patient data

// Refactored notification scheduling function
export const scheduleMedicationNotifications = async (drugName, timeCards, patientId, patientName) => {
  if (!Device.isDevice) {
    console.log('Must use a physical device for notifications');
   // return;
  }

  if (!patientId) {
    console.log('Patient ID is undefined or null');
    return;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission not granted for notifications');
    return;
  }

  const validTimeCards = timeCards
    .map((t) => {
      const isoDate = new Date(t.isoDate).toISOString();
      console.log('Checking formatted date:', isoDate);
      return { isoDate };
    })
    .filter((t) => !isNaN(new Date(t.isoDate)));

  if (validTimeCards.length === 0) {
    console.warn('No valid medication times to schedule');
    return;
  }

  for (const item of validTimeCards) {
    const incomingRawDate = item.isoDate;
    const parsedTrigger = new Date(incomingRawDate);
    const now = new Date();

    if (parsedTrigger <= now) {
      console.warn('⚠️ Skipping past date:', parsedTrigger);
      continue;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 Medication Reminder for ${patientName}`,
          body: `${drugName} - It's time to take your medication`,
          data: { isoDate: incomingRawDate, patientId: patientId },
          sound: 'default',
          categoryIdentifier: 'medicationReminder',
        },
        trigger: {
          type: 'date',
          date: parsedTrigger,
          channelId: 'default',
        },
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error.message);
    }
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('✅ All scheduled notifications:', scheduled);
};
export const registerNotificationActions = async () => {
  try {
    console.log('Registering notification actions...');
    await Notifications.setNotificationCategoryAsync('medicationReminder', [
      {
        identifier: MedicationActions.TAKE,
        buttonTitle: 'Mark as Taken',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: MedicationActions.SKIP,
        buttonTitle: 'Skip',
      },
    ]);
  } catch (error) {
    console.error('Failed to register notification actions:', error.message);
  }
};
