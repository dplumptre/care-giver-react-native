import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 5000;

// ✅ Hardcode your live/production URL here
const PRODUCTION_URL = 'https://your-api.aws.com/api'; // <- Replace this with your actual URL

const getBaseUrl = () => {

  if (PRODUCTION_URL) {
    console.log(`Using production URL: ${PRODUCTION_URL}`);
    return PRODUCTION_URL;
  }

  // Fallback for local dev
  const debuggerHost = Constants?.manifest?.debuggerHost || Constants?.expoConfig?.hostUri;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    console.log(`Using debuggerHost: http://${ip}:${PORT}/api`);
    return `http://${ip}:${PORT}/api`;
  }

  // Emulator fallback
  const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  console.log(`Using emulator fallback: http://${localhost}:${PORT}/api`);
  return `http://${localhost}:${PORT}/api`;
};

export const urlA = getBaseUrl();
