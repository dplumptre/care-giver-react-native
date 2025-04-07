import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useState } from "react";

const ResetScreen = ({ navigation }) => {


  const [payload, setPayload] = useState({
    emailOrUsername: '',
  });


  const [validationErrors, setValidationErrors] = useState({
    emailOrUsername: false,
  });


  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle form submission
  const onSubmit = () => {
    const { emailOrUsername } = payload;

    let isValid = true;
    let errors = { emailOrUsername: false };


    if (emailOrUsername.trim() === '') {
      errors.emailOrUsername = true;
      isValid = false;
    }

    setValidationErrors(errors);

    if (!isValid) {
      return;
    }

 
    console.log("Form Data Submitted:", payload);
  };

  // Navigate to sign-in screen
  const onFlipHandler = () => {
    navigation.replace("Signin");
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.inputLabel, validationErrors.emailOrUsername && styles.errorLabel]}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('emailOrUsername', text)}
        value={payload.emailOrUsername}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={onSubmit}>Reset Password</PrimaryButton>
      </View>

      <View style={styles.buttonContainer}>
        <FlatButton onPress={onFlipHandler}>Already Registered? Log in</FlatButton>
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
  inputLabel: {
    marginBottom: 4,
  },
  errorLabel: {
    color: "red", 
  },
  input: {
    height: 40,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  buttonContainer: {
    marginTop: 5,
  },
});

export default ResetScreen;
