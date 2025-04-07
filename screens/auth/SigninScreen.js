import { View, Text, TextInput, StyleSheet, Platform, Alert } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useContext, useState } from "react";
import { signinUser } from "../../util/auth";
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { authContext } from '../../store/auth-context';

const SigninScreen = ({ navigation }) => {
  const isLogin = true;
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(authContext);

  const [payload, setPayload] = useState({
    email: '',
    password: '',
  });


  const [validationErrors, setValidationErrors] = useState({
    email: false,
    password: false,
  });


  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev,
      [key]: value,
    }));
  };





  // Handle form submission
  const onSubmit =  async  () => {
    setIsLoading(true);
    const { email, password } = payload;

    let isValid = true;
    let errors = { email: false, password: false };

    if (!email.includes('@')) {
      errors.email = true;
      isValid = false;
      setIsLoading(false);
    }

    if (password.length < 6) {
      errors.password = true;
      isValid = false;
      setIsLoading(false);
    }

    setValidationErrors(errors);
    if (!isValid) {
      return;
      setIsLoading(false);
    }

    console.log("Form Data Submitted:", payload);


    try{
     const response = await signinUser(payload);
     console.log("success", response.data.data.jwtToken);
     authCtx.authenticate(response.data.data.jwtToken);
     Alert.alert("Login Successful!", response.data.message);
    }catch(error){
      console.log("Signin error:", error.response?.data || error.message);
      Alert.alert("Signin Failed!", error.response?.data?.message || "An error occurred.");
    }finally{
      setIsLoading(false);
    }



  };

  // Navigate to reset password screen
  const onResetHandler = () => {
    navigation.replace("Reset");
  };

  // Navigate to sign up screen
  const onFlipHandler = () => {
    if (isLogin) {
      navigation.replace("Signup");
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="Signing you in..." />;
  }
  return (
    <View style={styles.container}>
      <Text style={[styles.inputLabel, validationErrors.email && styles.errorLabel]}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('email', text)}
        value={payload.email}
      />

      <Text style={[styles.inputLabel, validationErrors.password && styles.errorLabel]}>Password:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('password', text)}
        value={payload.password}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <FlatButton position="right" onPress={onResetHandler}>
          Reset password
        </FlatButton>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={onSubmit}>Sign in</PrimaryButton>
      </View>

      <View style={styles.buttonContainer}>
        <FlatButton onPress={onFlipHandler}>
          {isLogin ? "Haven’t registered? Create a new user" : "Already Registered? Log in"}
        </FlatButton>
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
    color: "red", // Error color for validation failure
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

export default SigninScreen;
