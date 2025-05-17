import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 5000;

// ✅ Hardcode your live/production URL here
const PRODUCTION_URL = 'https://your-api.aws.com/api'; // <- Replace this with your actual URL

const getBaseUrl = () => {
  if (isProduction()) {
    console.log(`✅ Using production URL: ${PRODUCTION_URL}`);
    return PRODUCTION_URL;
  }

  const debuggerHost = Constants?.manifest?.debuggerHost || Constants?.expoConfig?.hostUri;

  if (debuggerHost) {
    const [host, port] = debuggerHost.split(':');

    // ✅ If host looks like a tunnel (e.g., ends with .ngrok.io), just use it directly
    if (host.endsWith('.ngrok.io')) {
      const tunnelUrl = `https://${host}/api`; // assuming HTTPS from Expo tunnel
      console.log(`🌐 Using tunnel URL: ${tunnelUrl}`);
      return tunnelUrl;
    }

    // Local network (LAN)
    const localUrl = `http://${host}:${PORT}/api`;
    console.log(`🔄 Using local network URL: ${localUrl}`);
    return localUrl;
  }

  // Emulator fallback
  const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const fallbackUrl = `http://${localhost}:${PORT}/api`;
  console.log(`🧪 Using emulator fallback: ${fallbackUrl}`);
  return fallbackUrl;
};

export const urlA = getBaseUrl();
