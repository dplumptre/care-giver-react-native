import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 2125;

const getBaseUrl = () => {
  // 1. If debuggerHost exists, grab IP from it (works for both LAN and Tunnel)
  const debuggerHost = Constants?.manifest?.debuggerHost || Constants?.expoConfig?.hostUri;
  const ip = debuggerHost?.split(':')[0];

  if (Constants.appOwnership === 'expo' && ip) {
    return `http://${ip}:${PORT}/api`;
  }

  // 2. Fallback for emulators
  const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${localhost}:${PORT}/api`;
};

export const urlA = getBaseUrl();
