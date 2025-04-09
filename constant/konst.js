import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 2125;

const getBaseUrl = () => {
  const debuggerHost = Constants?.manifest?.debuggerHost || Constants?.expoConfig?.hostUri;



  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    console.log(`http://${ip}:${PORT}/api`);
    return `http://${ip}:${PORT}/api`;
  }

  // Emulator fallback
  const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  console.log(`http://${localhost}:${PORT}/api`);
  return `http://${localhost}:${PORT}/api`;
};

export const urlA = getBaseUrl();
