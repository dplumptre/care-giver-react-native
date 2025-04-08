import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { createUser } from '../../util/auth';
import LoadingOverlay from '../../components/ui/LoadingOverlay';


const SignupScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLogin = false;
  const [showPassword, setShowPassword] = useState(false);


  const [payload, setPayload] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    fullName: false,
    username: false,
    email: false,
    password: false,
  });

  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev, [key]: value
    }));
  };

  const onSubmit = async () => {

    setIsLoading(true);
    const { fullName, username, email, password } = payload;

    let isValid = true;
    let errors = { fullName: false, username: false, email: false, password: false };

    // Full Name validation
    if (fullName.length < 5) {
      errors.fullName = true;
      isValid = false;
      setIsLoading(false);
    }

    // Username validation
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    if (username.length < 5) {
      errors.username = true;
      isValid = false;
      setIsLoading(false);
    } else if (!usernameRegex.test(username)) {
      errors.username = true;
      isValid = false;
      setIsLoading(false);
    }

    // Email validation
    if (!email.includes('@')) {
      errors.email = true;
      isValid = false;
      setIsLoading(false);
    }

    // Affected Side validation
    if (password === '') {
      errors.password = true;
      isValid = false;
      setIsLoading(false);
    }

    if (password.length < 5) {
      errors.password = true;
      isValid = false;
      setIsLoading(false);
    }


    setValidationErrors(errors);


    if (!isValid) {
      return;
    }



    try {
      const response = await createUser(payload);
      console.log('After createUser');
      console.log('Response:', response.data);
      console.log("Signup success:", response.data.message + " Please Signin");

      Alert.alert("Signup Successful!", response.data.message);
    } catch (error) {
      console.log("Signup error:", error.response?.data || error.message);
      Alert.alert("Signup Failed!", error.response?.data?.message || "An error occurred.");
    } finally {
      console.log("Stopping spinner");
      setIsLoading(false);
    }
    


  };

  const onFlipHandler = () => {
    if (!isLogin) {
      console.log("yes");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Signin' }],
      });
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="Sending request..." />;
  }
  return (


    <View style={styles.container}>
      <Text style={[styles.inputLabel, validationErrors.fullName && styles.errorLabel]}>Full Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('fullName', text)}
        value={payload.fullName}
      />

      <Text style={[styles.inputLabel, validationErrors.email && styles.errorLabel]}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('email', text)}
        value={payload.email}
      />

      <Text style={[styles.inputLabel, validationErrors.username && styles.errorLabel]}>Username:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('username', text)}
        value={payload.username}
      />

      <Text style={[styles.inputLabel, validationErrors.password && styles.errorLabel]}>
        Password:
      </Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          onChangeText={(text) => onChangeText('password', text)}
          value={payload.password}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={onSubmit}>Sign up</PrimaryButton>
      </View>

      <View style={styles.buttonContainer}>
        <FlatButton onPress={onFlipHandler}>
          {isLogin ? 'Haven’t registered? Create a new user' : 'Already Registered? Log in'}
        </FlatButton>
      </View>

      {isLoading && <LoadingOverlay message="Sending request..." />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    marginHorizontal: 12,
  },
  inputLabel: {
    marginBottom: 4,
  },
  input: {
    height: 40,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  buttonContainer: {
    marginTop: 5,
  },
  picker: {
    height: 50,
    width: '100%',  // Ensures the Picker takes the full width of the container
    marginBottom: 10,  // Adds spacing between the picker and other components
  },
  errorLabel: {
    color: 'red', // Error color for validation failure
  },
  iosPicker: {
    marginBottom: 100,  // Adjust spacing for iOS to give more room between Picker and button
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
  },
});

export default SignupScreen;



<Picker.Item label="Select affected side" value="" />