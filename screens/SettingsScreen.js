import { View, Text, TextInput, StyleSheet, Platform ,Alert} from "react-native";
import PrimaryButton from "../components/buttons/PrimaryButton";

const SettingsScreen = ({ navigation }) => {

  function pressButton(){
    Alert.alert("testing"," this thing is an issue");
  }


  return (
    <View style={styles.container}>
      

      <View style={styles.buttonContainer}>
        <Text>Settings</Text>
        <PrimaryButton onPress={pressButton} >click me</PrimaryButton>
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
