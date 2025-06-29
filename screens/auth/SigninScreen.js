import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useContext, useState } from "react";
import { signinUser } from "../../util/auth";
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { authContext } from '../../store/auth-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/Logo';

const SigninScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = true;
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(authContext);

  const [payload, setPayload] = useState({
    email: '',
    password: '',
  });


  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    server: '',
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
      errors.email = 'Please enter a valid email address.';
      isValid = false;
      setIsLoading(false);
    }

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
      isValid = false;
      setIsLoading(false);
    }

    setErrorMessages(errors);

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
      console.log('Signin error:', error.response?.data || error.message);
      setErrorMessages((prev) => ({
        ...prev,
        server: error.response?.data?.message || 'An error occurred. Please try again.',
      }));
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

    <Logo />
      
      {/* Email Input */}
      <Text style={[styles.inputLabel, validationErrors.email && styles.errorLabel]}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('email', text)}
        value={payload.email}
      />
      {errorMessages.email ? <Text style={styles.errorText}>{errorMessages.email}</Text> : null}
  
      {/* Password Input */}
      <Text style={[styles.inputLabel, validationErrors.password && styles.errorLabel]}>Password:</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          onChangeText={(text) => onChangeText('password', text)}
          value={payload.password}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {errorMessages.password ? <Text style={styles.errorText}>{errorMessages.password}</Text> : null}
  
      {/* Server Error Message */}
      {errorMessages.server ? <Text style={styles.serverErrorText}>{errorMessages.server}</Text> : null}
  
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <FlatButton position="right" onPress={onResetHandler}>
          Reset password
        </FlatButton>
      </View>
  
      <View style={styles.buttonContainer}>
        <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={onSubmit}>
          Sign in
        </PrimaryButton>
      </View>
  
      <View style={styles.buttonContainer}>
        <FlatButton onPress={onFlipHandler}>
          {isLogin ? 'Haven’t registered? Create a new user' : 'Already Registered? Log in'}
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

  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
  },errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  serverErrorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default SigninScreen;
