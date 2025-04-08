import { View, Text, TextInput, StyleSheet, Platform } from "react-native";

const SettingsScreen = ({ navigation }) => {




  return (
    <View style={styles.container}>
      

      <View style={styles.buttonContainer}>
        <Text>Settings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
    marginHorizontal: 12,
  },
});

export default SettingsScreen;
