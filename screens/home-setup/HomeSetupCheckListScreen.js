import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Platform, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { urlA } from '../../constant/konst';
import { authContext } from '../../store/auth-context';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { useFocusEffect } from '@react-navigation/native';

const HomeSetupCheckListScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [taskStatus, setTaskStatus] = useState({});
  const [checklistItems, setChecklistItems] = useState([]);
  const [isAllTasksCompleted, setIsAllTasksCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(authContext);

  useFocusEffect(
    useCallback(() => {
      const fetchPatients = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${urlA}/patients`, {
            headers: { Authorization: `Bearer ${authCtx.token}` },
          });
          setPatients(response.data.data);
        } catch (error) {
          console.log('Error fetching patients:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchPatients();
    }, [authCtx.token])
  );

  const onSelectedPatient = async (itemValue) => {
    if (!itemValue) {
      setChecklistItems([]);
      setSelectedPatient('');
      setSelectedPatientName('');
      return;
    }

    setSelectedPatient(itemValue);

    try {
      setIsLoading(true);
      const response = await axios.get(`${urlA}/home-setup/${itemValue}`, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });
      setChecklistItems(response.data.data);
    } catch (error) {
      console.log('Error fetching task list:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = () => {
    navigation.navigate('PatientModule', {
      screen: 'AddPatient',
    });
  };

  const renderChecklistItem = ({ item }) => {
    const isTaskCompleted =
      taskStatus[selectedPatient]?.[item.id] !== undefined
        ? taskStatus[selectedPatient][item.id]
        : item.isCompleted;

    return (
      <View style={styles.card}>
        <View style={styles.taskTextContainer}>
          <Text style={styles.taskTitle}>{item.taskTitle}</Text>
          {item.taskDescription ? (
            <Text style={styles.taskDescription}>{item.taskDescription}</Text>
          ) : null}
        </View>
        <Switch
          value={!!isTaskCompleted}
          onValueChange={() => handleToggle(item.id, isTaskCompleted)}
        />
      </View>
    );
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      {patients.length === 0 ? (
        <View style={styles.noPatientsContainer}>
          <Text style={styles.noPatientsText}>No patients found.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PatientModule', { screen: 'AddPatient' })}>
  <Text style={styles.addPatientLink}>Click here to add a patient</Text>
</TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={(itemValue) => onSelectedPatient(itemValue)}
              style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
              mode="dropdown"
            >
              <Picker.Item label="-- Choose Patient --" value="" />
              {patients.map((patient) => (
                <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
              ))}
            </Picker>
          </View>

          {selectedPatient ? (
            <FlatList
              data={checklistItems}
              keyExtractor={(item) => item.id}
              renderItem={renderChecklistItem}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <Text style={styles.infoText}>Please select a patient to view checklist</Text>
          )}
        </>
      )}
    </View>
  );
};

export default HomeSetupCheckListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
    height: 50,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  taskTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#888',
    marginTop: 100,
    textAlign: 'center',
  },
  iosPicker: {
    height: 180,
  },
});