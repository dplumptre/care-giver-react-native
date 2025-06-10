import { View, Text, TextInput, StyleSheet, Platform, Alert } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useState } from "react";
import Logo from "../../components/Logo";
import axios from "axios";
import { urlA } from "../../constant/konst";

const ResetScreen = ({ navigation }) => {


  const [payload, setPayload] = useState({
    emailOrUsername: '',
  });


  const [validationErrors, setValidationErrors] = useState({
    emailOrUsername: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    emailOrUsername: ''
  });


  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle form submission
  const onSubmit = async () => {
    const { emailOrUsername } = payload;
  
    // Reset errors
    let isValid = true;
    let errors = { emailOrUsername: "" };
  
    // Validate input
    if (emailOrUsername.trim() === "") {
      errors.emailOrUsername = "Email address is required.";
      isValid = false;
    } else if (!emailOrUsername.includes("@")) {
      errors.emailOrUsername = "Please enter a valid email address.";
      isValid = false;
    }
  
    setErrorMessages(errors);
    setValidationErrors({ emailOrUsername: !!errors.emailOrUsername });
  
    if (!isValid) {
      return; // Stop submission if validation fails
    }
  
    try {
      const resp = await axios.post(
        `${urlA}/auth/forget-password`,
        {
          email: emailOrUsername,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = resp.data;
      console.log("Code sent:", data);
      Alert.alert(
        "Code Sent",
        "If the email is registered, a reset code has been sent to your email address.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("PasswordReset", { emailOrUsername }),
          },
        ]
      );
    } catch (error) {
      console.log("Failed to send reset email:", error.message);
      Alert.alert("Error", "Failed to send reset email. Please try again.");
    }
  };

  // Navigate to sign-in screen
  const onFlipHandler = () => {
    navigation.replace("Signin");
  };

  return (
    <View style={styles.container}>
          <Logo />

  
      <Text style={[styles.inputLabel, validationErrors.emailOrUsername && styles.errorLabel]}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('emailOrUsername', text)}
        value={payload.emailOrUsername}
      />
      {errorMessages.emailOrUsername ? <Text style={styles.errorLabel}>{errorMessages.emailOrUsername}</Text> : null}  

      <View style={styles.buttonContainer}>
        <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={onSubmit}>Reset Password</PrimaryButton>
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
  errorLabel: {
    color: 'red',
  },
});

export default ResetScreen;
