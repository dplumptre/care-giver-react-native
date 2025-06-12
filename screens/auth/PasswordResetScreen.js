import { View, Text, TextInput, StyleSheet, Platform, Alert } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useState } from "react";
import Logo from "../../components/Logo";
import axios from "axios";
import { urlA } from "../../constant/konst";

const PasswordResetScreen = ({route, navigation }) => {



  const { emailOrUsername } = route.params;


  const [payload, setPayload] = useState({
    password: '',
    confirmPassword: '',
    code: '',
  });


  const [validationErrors, setValidationErrors] = useState({
    password: false,
    confirmPassword: false,
    code: false,
  });


  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle form submission
  const onSubmit = async () => {
    const { password, confirmPassword, code } = payload;
  
    let isValid = true;
    let errors = {
      password: "",
      confirmPassword: "",
      code: "",
    };
  
    // Validate password
    if (password.trim() === "") {
      errors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }
  
    // Validate confirmPassword
    if (confirmPassword.trim() === "") {
      errors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
  
    // Validate code
    if (code.trim() === "" || code.length < 6) {
      errors.code = "Reset code is required & should be 6 characters.";
      isValid = false;
    }
  
    setValidationErrors(errors);
  
    if (!isValid) {
      return; // Stop submission if validation fails
    }
  
    try {
      const resp = await axios.post(
        `${urlA}/auth/reset-password/${emailOrUsername}`,
        {
          password,
          confirmPassword,
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = resp.data;
      console.log("Password reset successful:", data);
      Alert.alert(
        "Password Successfully Reset",
        "Your password has been successfully reset. You can now log in with your new password.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Signin"),
          },
        ]
      );
    } catch (error) {
        const serverMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
        Alert.alert("Error", serverMessage);
        console.log("Failed to reset password:", serverMessage);
        
      }
  }
  
  

  // Navigate to sign-in screen
  const onFlipHandler = () => {
    navigation.replace("Signin");
  };

  return (
<View style={styles.container}>
  <Logo />

  {/* Password Field */}
  <Text style={[styles.inputLabel, validationErrors.password && styles.errorLabel]}>
    Password:
  </Text>
  <TextInput
    style={styles.input}
    onChangeText={(text) => onChangeText("password", text)}
    value={payload.password}
    secureTextEntry
  />
  {validationErrors.password ? (
    <Text style={styles.errorText}>{validationErrors.password}</Text>
  ) : null}

  {/* Confirm Password Field */}
  <Text style={[styles.inputLabel, validationErrors.confirmPassword && styles.errorLabel]}>
    Confirm Password:
  </Text>
  <TextInput
    style={styles.input}
    onChangeText={(text) => onChangeText("confirmPassword", text)}
    value={payload.confirmPassword}
    secureTextEntry
  />
  {validationErrors.confirmPassword ? (
    <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
  ) : null}

  {/* Code Field */}
  <Text style={[styles.inputLabel, validationErrors.code && styles.errorLabel]}>
    Code:
  </Text>
  <TextInput
    style={styles.input}
    onChangeText={(text) => onChangeText("code", text)}
    value={payload.code}
  />
  {validationErrors.code ? (
    <Text style={styles.errorText}>{validationErrors.code}</Text>
  ) : null}

  {/* Submit Button */}
  <View style={styles.buttonContainer}>
    <PrimaryButton style={{ backgroundColor: "#522E2E" }} onPress={onSubmit}>
      Reset Password
    </PrimaryButton>
  </View>

  {/* Navigate to Sign-in */}
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
      marginBottom: 10,
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
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 10,
    },
    buttonContainer: {
      marginTop: 5,
    },
  });

export default PasswordResetScreen;
