import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingOverlay = ({ message }) => {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
});
