import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { urlA } from '../../constant/konst';
import { authContext } from '../../store/auth-context';
import axios from 'axios';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import IconButton from '../../components/buttons/IconButton';
import { scheduleMedicationNotifications } from '../../util/notificationHelper';


const EditMedicationScreen = ({ route, navigation }) => {
  const { name, medicationId } = route.params;

  const [selectedPatient, setSelectedPatient] = useState('');
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeCards, setTimeCards] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(authContext);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit " + name
    });
  }, [navigation, name]);



  function headerButtonPressHandler() {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            console.log("Medication deleted");
            try {
              await axios.delete(`${urlA}/medications/${medicationId}`, {
                headers: {
                  Authorization: "Bearer " + authCtx.token,
                },
              });
              Alert.alert("Deleted", "Medication deleted successfully.", [
                { text: "OK", onPress: () => navigation.navigate("MedicationDashboard") },
              ]);
            } catch (error) {
              console.error("Delete failed:", error.message);
              Alert.alert("Error", "Failed to delete Medication.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <IconButton onPressHandler={headerButtonPressHandler} name="trash" size={24} color="#522E2E" />
      }
    })
  }, [navigation, headerButtonPressHandler])


  useEffect(() => {
    console.log(`${urlA}/patients`)
    setIsLoading(true);
    const getPatients = () => {
      axios.get(`${urlA}/patients`, {
        headers: {
          Authorization: 'Bearer ' + authCtx.token
        }
      }).then(response => {
        const data = response.data.data;
        // console.log(response.data);
        //console.log(data);
        setPatientList(data);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setIsLoading(false);
      })
    }
    getPatients();
  }, []);






  useEffect(() => {

    if (medicationId) {
      setIsLoading(true);

      const getMedication = () => {
        axios
          .get(`${urlA}/medications/${medicationId}`, {
            headers: {
              Authorization: 'Bearer ' + authCtx.token,
            },
          })
          .then((response) => {
            const data = response.data.data;
            console.log(data.drugName + " " + data.dosage);
            //  console.log(data);

            // Set states using the real response
            setDrugName(data.drugName);
            setDosage(data.dosage);
            setSelectedPatient(data.patient?.id); // check for optional chaining



            if (data.dosageTimes.length > 0) {
              setTimeCards(
                data.dosageTimes.map((dt) => ({
                  isoDate: dt.time,
                  formattedDate: new Date(dt.time).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }).replace(',', ''),
                }))
              );
            }





          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

      getMedication();
    }
  }, [medicationId, authCtx.token, navigation]);






  const handleAddTime = () => {
    const isoDate = selectedDate.toISOString(); // ISO format for backend
    const formattedDate = selectedDate.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(',', ''); // Format as "YYYY-MM-DD HH:mm"
    setTimeCards((prev) => [...prev, { isoDate, formattedDate }]);
    setShowDatePicker(false); // Close the picker after adding the time
  };

  const handleDeleteTime = (time) => {
    setTimeCards((prev) => prev.filter((t) => t.isoDate !== time.isoDate));
  };

  const handleSave = async () => {


    console.log("Selected Patient:", selectedPatient);


    if (!selectedPatient || !drugName || !dosage || timeCards.length === 0) {
      Alert.alert('Error', 'Please fill out all fields and add at least one time.');
      return;
    }

    const payload = {
      patientId: selectedPatient,
      drugName,
      dosage,
      times: timeCards.map((t) => ({ time: t.isoDate }))
    };


    const myRequest = {
      drugName: payload.drugName,
      dosage: payload.dosage,
      patientId: payload.patientId,
      dosageTimes: payload.times
    }
    console.log('Payload:', myRequest);
    setIsLoading(true);





    if (!selectedPatient) {
      console.log('Patient ID is undefined or null');
      return;
    }




    try {
      const resp = await axios.get(`${urlA}/patients/${payload.patientId}`, {
        headers: {
          Authorization: "Bearer " + authCtx.token,
        },
      });
      const patient = resp.data.data;
      console.log("Patient Name: from db", patient.name);



      try {
        const resp = await axios.put(
          `${urlA}/medications/${medicationId}`,
          myRequest,
          {
            headers: {
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        const data = resp.data;
        console.log("medication created:", data);


        console.log("Raw timeCards data:", timeCards);

        // Format the time cards for notifications
        const formattedTimeCards = timeCards.map((t) => ({
          isoDate: t.isoDate,
        }));
        console.log("Scheduling notifications for:", formattedTimeCards);
        console.log('drugName:', payload.drugName);
        console.log('patientId:', payload.patientId);
        console.log('formattedTimeCards:', formattedTimeCards);
        try {
          // Schedule notifications
          await scheduleMedicationNotifications(payload.drugName, formattedTimeCards, payload.patientId, patient.name);
        } catch (err) {
          console.error("Failed to schedule notification:", err.message);
        }
        Alert.alert(
          "Medication Updated",
          "You have successfully Updated a medication",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("MedicationDashboard")
            }
          ]
        );
      } catch (error) {
        console.error("Failed to update medication:", error.message);
      } finally {
        setIsLoading(false);
      };











    } catch (error) {
      Alert.alert("Error", "Failed to fetch patient data.");
      console.error(error);
    }




  };

  const renderTimeCard = ({ item }) => (
    <View style={styles.timeCard}>
      <Text style={styles.timeText}>{item.formattedDate}</Text>
      <TouchableOpacity onPress={() => handleDeleteTime(item)}>
        <Ionicons name="trash" size={20} color="#C57575" />
      </TouchableOpacity>
    </View>
  );


  if (isLoading) {
    return <LoadingOverlay message="Loading..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        <Text style={styles.inputLabel}>Patient:</Text>

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






        <Text style={styles.inputLabel}>Drug Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Drug Name"
          value={drugName}
          onChangeText={setDrugName}
        />

        <Text style={styles.inputLabel}>Dosage:</Text>
        <TextInput
          style={styles.input}
          placeholder="Dosage (numbers only)"
          value={dosage.toString()}
          onChangeText={setDosage}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.addTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="add-circle" size={28} color="#C57575" />
          <Text style={styles.addTimeText}>Add Time</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleAddTime}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.timeCardContainer}>
          {timeCards.map((item, index) => (
            <View key={index} style={styles.timeCard}>
              <Text style={styles.timeText}>{item.formattedDate}</Text>
              <TouchableOpacity onPress={() => handleDeleteTime(item)}>
                <Ionicons name="trash" size={20} color="#C57575" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={handleSave}>
          Save
        </PrimaryButton>
      </View>
    </ScrollView>
  );
};

export default EditMedicationScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  pickerWrapper: {
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  iosPicker: {
    height: 180,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTimeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#C57575',
  },
  confirmButton: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },
  timeCardContainer: {
    marginTop: 16,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDEDEC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
});