import { View, Text, TextInput, StyleSheet, Platform, Alert, TouchableOpacity } from 'react-native';
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FlatButton from "../../components/buttons/FlatButton";
import { useContext, useState } from 'react';
import { Picker } from '@react-native-picker/picker'; 
import { authContext } from '../../store/auth-context';
import axios from 'axios';
import { urlA } from '../../constant/konst';
import { AffectedSide } from '../../util/enum';

const AddPatientScreen = ({ navigation }) => {
  const authCtx = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);

  const [payload, setPayload] = useState({
    fullName: '',
    phone: '',
    address: '',
    affectedSide: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    phone: '',
    address: '',
    affectedSide: false,
  });

  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev, [key]: value
    }));
  };

  const onSubmit = async () => {
    const { fullName, phone, address, affectedSide } = payload;
  
    let isValid = true;
    let errors = { fullName: '', phone: '', address: '', affectedSide: '' };
  
    // Full Name validation
    if (!fullName || fullName.trim().length < 5) {
      errors.fullName = 'Full name must be at least 5 characters long.';
      isValid = false;
    }
  
    // Phone validation
    if (!phone || isNaN(phone) || phone.trim() === '') {
      errors.phone = 'Please enter a valid phone number.';
      isValid = false;
    }
  
    // Affected Side validation
    if (!affectedSide) {
      errors.affectedSide = 'Please select an affected side.';
      isValid = false;
    }
  
    setValidationErrors(errors);
  
    if (!isValid) {
      return;
    }
  
    console.log('Form Data Submitted:', payload);
    setIsLoading(true);

    try {
      const resp = await axios.post(
        `${urlA}/patients`,
        {
          name: payload.fullName,
          phone: payload.phone,
          address: payload.address,
          affectedSide: payload.affectedSide,
        },
        {
          headers: {
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      const data = resp.data;
      console.log("patient created:", data);
      Alert.alert(
        "Patient Created",
        "You have successfully created a patient",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("PatientDashboard")
          }
        ]
      );
    } catch (error) {
      console.log("Failed to create patient:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full Name Input */}
      <Text style={[styles.inputLabel, validationErrors.fullName && styles.errorLabel]}>Full Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('fullName', text)}
        value={payload.fullName}
      />
      {validationErrors.fullName ? <Text style={styles.errorText}>{validationErrors.fullName}</Text> : null}
  
      {/* Phone Input */}
      <Text style={[styles.inputLabel, validationErrors.phone && styles.errorLabel]}>Phone:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('phone', text)}
        value={payload.phone}
        keyboardType="numeric"
      />
      {validationErrors.phone ? <Text style={styles.errorText}>{validationErrors.phone}</Text> : null}
  
      {/* Address Input */}
      <Text style={[styles.inputLabel, validationErrors.address && styles.errorLabel]}>Address:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('address', text)}
        value={payload.address}
      />
      {validationErrors.address ? <Text style={styles.errorText}>{validationErrors.address}</Text> : null}
  
      {/* Affected Side Picker */}
      <Text style={[styles.inputLabel, validationErrors.affectedSide && styles.errorLabel]}>Affected Side:</Text>
      <Picker
        selectedValue={payload.affectedSide}
        onValueChange={(text) => onChangeText('affectedSide', text)}
        style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
      >
        <Picker.Item label="Select affected side" value="" />
        <Picker.Item label="Right" value={AffectedSide.RIGHT_SIDE} />
        <Picker.Item label="Left" value={AffectedSide.LEFT_SIDE} />
        <Picker.Item label="Both sides" value={AffectedSide.BOTH} />
        <Picker.Item label="Others" value={AffectedSide.OTHERS} />
      </Picker>
      {validationErrors.affectedSide ? <Text style={styles.errorText}>{validationErrors.affectedSide}</Text> : null}
  
      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={onSubmit}>
          Submit
        </PrimaryButton>
      </View>

      {/* Link to Dashboard */}
      <TouchableOpacity
  onPress={() =>
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })
  }
>
  <Text style={styles.backToDashboardLink}>Back to Main Dashboard</Text>
</TouchableOpacity>
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  errorLabel: {
    color: 'red',
  },
  iosPicker: {
    marginBottom: 100, 
  },
  backToDashboardLink: {
    fontSize: 16,
    color: '#C57575',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default AddPatientScreen;