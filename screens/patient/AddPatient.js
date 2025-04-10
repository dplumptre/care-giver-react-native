import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker'; 

const AddPatient = ({ navigation }) => {
  const isLogin = false;

  const [payload, setPayload] = useState({
    fullName: '',
    phone: '',
    address: '',
    affectedSide: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    fullName: false,
    phone: false,
    address: false,
    affectedSide: false,
  });

  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev, [key]: value
    }));
  };

  const onSubmit = () => {
    const { fullName, phone, address, affectedSide } = payload;
  
    let isValid = true;
    let errors = { fullName: false, phone: false, address: false, affectedSide: false };
  
    // Full Name validation
    if (fullName.length < 5) {
      errors.fullName = true;
      isValid = false;
    }
  
    // phone validation

    if (!phone || isNaN(phone) || phone.trim() === '') {
        errors.phone = true;
        isValid = false;
      }
  

    // Affected Side validation
    if (affectedSide === '') {
      errors.affectedSide = true;
      isValid = false;
    }
  
    setValidationErrors(errors);
  
  
    if (!isValid) {
      return;
    }
  

    console.log('Form Data Submitted:', payload);
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

  return (
    <View style={styles.container}>
<Text style={[styles.inputLabel, validationErrors.fullName && styles.errorLabel]}>Full Name</Text>
<TextInput
  style={styles.input}
  onChangeText={(text) => onChangeText('fullName', text)}
  value={payload.fullName}
/>

<Text style={[styles.inputLabel, validationErrors.phone && styles.errorLabel]}>phone:</Text>
<TextInput
  style={styles.input}
  onChangeText={(text) => onChangeText('phone', text)}
  value={payload.phone}
/>

<Text style={[styles.inputLabel, validationErrors.address && styles.errorLabel]}>address:</Text>
<TextInput
  style={styles.input}
  onChangeText={(text) => onChangeText('address', text)}
  value={payload.address}
/>


<Text style={[styles.inputLabel, validationErrors.affectedSide && styles.errorLabel]}>Affected Side:</Text>
      <Picker
        selectedValue={payload.affectedSide}
        onValueChange={(text) => onChangeText('affectedSide', text)}
        style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
      >



        <Picker.Item label="Select affected side" value="" />
        <Picker.Item label="Right" value="right" />
        <Picker.Item label="Left" value="left" />
        <Picker.Item label="Both sides" value="both" />
        <Picker.Item label="None / Not Applicable" value="none" />
      </Picker>

      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={onSubmit}>Sign up</PrimaryButton>
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
    width: '100%',  
    marginBottom: 10,  
  }, 
   errorLabel: {
    color: 'red', 
  },
  iosPicker: {
    marginBottom: 100, 
  },
});

export default AddPatient;



<Picker.Item label="Select affected side" value="" />