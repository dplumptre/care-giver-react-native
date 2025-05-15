import { View, Text, TextInput, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker'; 
import { authContext } from '../../store/auth-context';
import axios from 'axios';
import { urlA } from '../../constant/konst';
import { AffectedSide } from '../../util/enum';

const EditPatientScreen = ({ navigation, route }) => {
  const authCtx = useContext(authContext);
  const { patientId } = route.params;

  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const resp = await axios.get(`${urlA}/patients/${patientId}`, {
          headers: {
            Authorization: "Bearer " + authCtx.token,
          },
        });
        const patient = resp.data.data;
        setPayload({
          fullName: patient.name,
          phone: patient.phone,
          address: patient.address,
          affectedSide: patient.affectedSide,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to fetch patient data.");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  const onChangeText = (key, value) => {
    setPayload((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = async () => {
    const { fullName, phone, address, affectedSide } = payload;

    let isValid = true;
    let errors = { fullName: false, phone: false, address: false, affectedSide: false };

    if (fullName.length < 5) {
      errors.fullName = true;
      isValid = false;
    }

    if (!phone || isNaN(phone) || phone.trim() === '') {
      errors.phone = true;
      isValid = false;
    }

    if (affectedSide === '') {
      errors.affectedSide = true;
      isValid = false;
    }

    setValidationErrors(errors);
    if (!isValid) return;

    setIsLoading(true);

    try {
      const resp = await axios.put(
        `${urlA}/patients/${patientId}`,
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
      console.log("patient updated:", data);
      Alert.alert(
        "Success",
        "Patient updated successfully",
        [{ text: "OK", onPress: () => navigation.navigate("PatientDasboard") }]
      );
    } catch (error) {
      console.log("Failed to update patient:", error.message);
      Alert.alert("Error", "Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading patient data...</Text>
      </View>
    );
  }




  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${urlA}/patients/${patientId}`, {
        headers: {
          Authorization: "Bearer " + authCtx.token,
        },
      });
      Alert.alert("Deleted", "Patient deleted successfully.", [
        { text: "OK", onPress: () => navigation.navigate("PatientDasboard") },
      ]);
    } catch (error) {
      console.log("Delete failed:", error.message);
      Alert.alert("Error", "Failed to delete patient.");
    } finally {
      setIsLoading(false);
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

      <Text style={[styles.inputLabel, validationErrors.phone && styles.errorLabel]}>Phone</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('phone', text)}
        value={payload.phone}
        keyboardType="numeric"
      />

      <Text style={[styles.inputLabel, validationErrors.address && styles.errorLabel]}>Address</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText('address', text)}
        value={payload.address}
      />

      <Text style={[styles.inputLabel, validationErrors.affectedSide && styles.errorLabel]}>Affected Side</Text>
      <Picker
        selectedValue={payload.affectedSide}
        onValueChange={(value) => onChangeText('affectedSide', value)}
        style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
      >
        <Picker.Item label="Select affected side" value="" />
        <Picker.Item label="Right" value={AffectedSide.RIGHT_SIDE} />
        <Picker.Item label="Left" value={AffectedSide.LEFT_SIDE} />
        <Picker.Item label="Both sides" value={AffectedSide.BOTH} />
        <Picker.Item label="Others" value={AffectedSide.OTHERS} />
      </Picker>

      <View style={styles.buttonContainer}>
        <PrimaryButton style={{ backgroundColor: '#522E2E' }}onPress={onSubmit} >Update</PrimaryButton>
        <PrimaryButton
        style={{ backgroundColor: '#c62828' }}
  onPress={() =>
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this patient?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    )
  }
  customStyle={{ backgroundColor: 'red', marginTop: 10 }}
>
  Delete Patient
</PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default EditPatientScreen;
