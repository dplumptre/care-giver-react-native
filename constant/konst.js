import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 2125;

// Get local IP of your machine (update this if your IP changes)
const localIP = '192.168.1.110';

// Choose host based on platform
const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Smart base URL decision
export const urlA =
  Constants.appOwnership === 'expo'
    ? `http://${localIP}:${PORT}/api` // running via Expo Go on real device
    : `http://${localhost}:${PORT}/api`; // running in emulator/simulator
