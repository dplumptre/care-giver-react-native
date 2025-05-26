import React, { useContext, useLayoutEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MedicationItem from '../../components/medication/medicationItem';
import IconButton from '../../components/buttons/IconButton';
import { urlA } from '../../constant/konst';
import { authContext } from '../../store/auth-context';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const MedicationDashboardScreen = ({ navigation }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medications, setMedications] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(authContext);

  // Fetch patients on screen focus
  useFocusEffect(
    useCallback(() => {
      const fetchPatients = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${urlA}/patients`, {
            headers: {
              Authorization: 'Bearer ' + authCtx.token,
            },
          });
          setPatientList(response.data.data);
        } catch (error) {
          console.log('Error fetching patients:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPatients();
    }, [authCtx.token])
  );

  // Navigate to Add Medication Screen
  function headerButtonPressHandler() {
    navigation.navigate('AddMedication');
  }

  // Set header button for adding medication
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPressHandler={headerButtonPressHandler}
          name="add"
          size={24}
          color="#522E2E"
        />
      ),
    });
  }, [navigation, headerButtonPressHandler]);

  // Navigate to Add Patient Screen
  const handleAddPatient = () => {
    navigation.navigate('PatientModule', {
      screen: 'AddPatient',
    });
  };

  return (
    <View style={styles.container}>
      {/* Check if there are no patients */}
      {patientList.length === 0 ? (
        <View style={styles.noPatientsContainer}>
          <Text style={styles.noPatientsText}>No patients found.</Text>
          <TouchableOpacity onPress={handleAddPatient}>
            <Text style={styles.addPatientLink}>Click here to add a patient</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Patient Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={(itemValue) => setSelectedPatient(itemValue)}
              style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
              mode="dropdown"
            >
              <Picker.Item label="-- Select Patient --" value="" />
              {patientList.map((patient) => (
                <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
              ))}
            </Picker>
          </View>

          {/* Medications List */}
          {selectedPatient ? (
            <FlatList
              data={medications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <MedicationItem item={item} />}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={true}
              style={{ flex: 1 }}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.infoText}>Please select a patient to view medications</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default MedicationDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  noPatientsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPatientsText: {
    fontSize: 16,
    color: '#522E2E',
    marginBottom: 8,
  },
  addPatientLink: {
    fontSize: 16,
    color: '#C57575',
    textDecorationLine: 'underline',
  },
  pickerWrapper: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
  },
  iosPicker: {
    height: 200,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#522E2E',
    textAlign: 'center',
  },
});