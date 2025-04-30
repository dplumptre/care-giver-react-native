import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { urlA } from '../../constant/konst';
import { authContext } from '../../store/auth-context';
import LoadingOverlay from '../../components/ui/LoadingOverlay';

const HomeSetupCheckListScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPatientName, setSelectedPatientName] = useState(''); // Store the selected patient's name
  const [taskStatus, setTaskStatus] = useState({});
  const [checklistItems, setChecklistItems] = useState([]);
  const [isAllTasksCompleted, setIsAllTasksCompleted] = useState(false); // Track if all tasks are completed
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const authCtx = useContext(authContext);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${urlA}/patients`, {
          headers: { Authorization: `Bearer ${authCtx.token}` },
        });
        setPatients(response.data.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [authCtx.token]);

  const fetchPatientDetails = async (patientId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${urlA}/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });
      setSelectedPatientName(response.data.data.name); // Set the patient's name
    } catch (error) {
      console.error('Error fetching patient details:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectedPatient = async (itemValue) => {
    if (!itemValue) {
      setChecklistItems([]);
      setSelectedPatient('');
      setSelectedPatientName('');
      return;
    }

    setSelectedPatient(itemValue);
    await fetchPatientDetails(itemValue); // Fetch the selected patient's details

    try {
      setIsLoading(true);
      const response = await axios.get(`${urlA}/home-setup/${itemValue}`, {
        headers: { Authorization: `Bearer ${authCtx.token}` },
      });
      setChecklistItems(response.data.data);
    } catch (error) {
      console.error('Error fetching task list:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (taskId, currentStatus) => {
    try {
        // Optimistic UI update
        const updatedTaskStatus = {
            ...taskStatus[selectedPatient],
            [taskId]: !currentStatus,
        };

        setTaskStatus((prev) => ({
            ...prev,
            [selectedPatient]: updatedTaskStatus,
        }));

        const status = !currentStatus;

        await axios.put(
            `${urlA}/home-setup/${selectedPatient}/update-task`,
            {
                taskId: taskId,
                isCompleted: !currentStatus,
            },
            {
                headers: {
                    Authorization: `Bearer ${authCtx.token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Task status updated successfully');

        // Fetch the latest task completion status from the server
        const response = await axios.get(`${urlA}/home-setup/${selectedPatient}`, {
            headers: { Authorization: `Bearer ${authCtx.token}` },
        });

        const latestChecklistItems = response.data.data;

        // Check if all tasks are completed based on the latest data
        const allTasksCompleted = latestChecklistItems.every((task) => task.isCompleted);

        // Only show the alert if transitioning from incomplete to complete
        if (allTasksCompleted && !isAllTasksCompleted) {
            setIsAllTasksCompleted(true); // Update the state to reflect the completed status
            Alert.alert(
                'Congratulations!',
                `You have completed the home setup for ${selectedPatientName}!`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'HomeSetupResult',
                                        params: { patientName: selectedPatientName },
                                    },
                                ],
                            });
                        },
                    },
                ]
            );
        } else if (!allTasksCompleted && isAllTasksCompleted) {
            // Update the state to reflect the incomplete status
            setIsAllTasksCompleted(false);
        }
    } catch (error) {
        console.error('Error updating task status:', error.response?.data || error.message);

        // Rollback UI update on error
        setTaskStatus((prev) => ({
            ...prev,
            [selectedPatient]: {
                ...prev[selectedPatient],
                [taskId]: currentStatus,
            },
        }));
    }
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