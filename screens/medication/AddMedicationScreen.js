import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    Platform,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { urlA } from '../../constant/konst';
import { authContext } from '../../store/auth-context';
import axios from 'axios';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { registerNotificationActions, scheduleMedicationNotifications } from '../../util/notificationHelper';


const AddMedicationScreen = ({ navigation }) => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [drugName, setDrugName] = useState('');
    const [dosage, setDosage] = useState('');
    const [timeCards, setTimeCards] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [patientList, setPatientList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const authCtx = useContext(authContext);
    const [validationErrors, setValidationErrors] = useState({
        patient: false,
        drugName: false,
        dosage: false,
    });



    useEffect(() => {
        registerNotificationActions();
    }, []);


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
                console.log(response.data);
                console.log(data);
                setPatientList(data);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            })
        }
        getPatients();
    }, []);





    const handleDateChange = (event, date) => {
        if (event?.type === 'set' && date) {
            setSelectedDate(date);
            if (Platform.OS === 'android') {
                setShowDatePicker(false);
                setShowTimePicker(true);
            }
        } else {
            setShowDatePicker(false);
            setShowTimePicker(false);
        }
    };

    const handleTimeChange = (event, time) => {
        if (event?.type === 'set' && time) {
            const updatedDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                time.getHours(),
                time.getMinutes()
            );
            setSelectedDate(updatedDate);

            if (Platform.OS === 'android') {
                handleAddTime(updatedDate);
            }
        }

        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
    };

    const handleAddTime = (finalDate = selectedDate) => {
        const isoDate = finalDate.toISOString();
        const formattedDate = finalDate.toLocaleString();

        const alreadyExists = timeCards.some((t) => t.isoDate === isoDate);
        if (!alreadyExists) {
            setTimeCards((prev) => [...prev, { isoDate, formattedDate }]);
        }

        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    const handleCancelDate = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    const handleDeleteTime = (time) => {
        setTimeCards((prev) => prev.filter((t) => t.isoDate !== time.isoDate));
    };

    const handleSave = async () => {
        const payload = {
            patientId: selectedPatient,
            drugName,
            dosage,
            times: timeCards.map((t) => ({ time: t.isoDate }))
        };

        let isValid = true;
        let errors = { patient: false, drugName: false, dosage: false };

        if (payload.patientId === '') {
            errors.patient = true;
            isValid = false;
        }

        if (drugName.length < 3) {
            errors.drugName = true;
            isValid = false;
        }

        if (dosage === '' || isNaN(dosage)) {
            errors.dosage = true;
            isValid = false;
        }

        setValidationErrors(errors);

        if (!isValid) return;


        const myRequest = {
            drugName: payload.drugName,
            dosage: payload.dosage,
            patientId: payload.patientId,
            dosageTimes: payload.times
        }
        console.log('Payload:', myRequest);
        setIsLoading(true);




        if (!payload.patientId) {
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
                const resp = await axios.post(`${urlA}/medications`, myRequest, {
                    headers: { Authorization: "Bearer " + authCtx.token },
                });

                const data = resp.data;
                console.log("medication created:", data);

                if (data.success) {
                    console.log("start schedule notifications");

                    // Log the time cards right before formatting
                    console.log("Raw timeCards data:", timeCards);

                    // Format the time cards for notifications
                    const formattedTimeCards = timeCards.map((t) => ({
                        isoDate: t.isoDate,
                    }));
                    console.log("Scheduling notifications for:", formattedTimeCards);

                    try {
                        // Schedule notifications
                        await scheduleMedicationNotifications(payload.drugName, formattedTimeCards, payload.patientId, patient.name);
                    } catch (err) {
                        console.log("Failed to schedule notification:", err.message);
                    }
                }

                Alert.alert("Medication Created", "You have successfully added a medication", [
                    { text: "OK", onPress: () => navigation.navigate("MedicationDashboard") },
                ]);
            } catch (error) {
                console.log("Failed to create medication:", error.message);
            } finally {
                setIsLoading(false);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch patient data.");
            console.log(error);
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
                <Text style={[styles.inputLabel, validationErrors.patient && styles.errorLabel]}>Patient:</Text>
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

                {!showDatePicker && !showTimePicker && (
                    <>
                        <Text style={[styles.inputLabel, validationErrors.drugName && styles.errorLabel]}>Drug Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Drug Name"
                            value={drugName}
                            onChangeText={setDrugName}
                        />

                        <Text style={[styles.inputLabel, validationErrors.dosage && styles.errorLabel]}>Dosage:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dosage (numbers only)"
                            value={dosage}
                            onChangeText={setDosage}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity style={styles.addTimeButton} onPress={() => setShowDatePicker(true)}>
                            <Ionicons name="add-circle" size={28} color="#C57575" />
                            <Text style={styles.addTimeText}>Add Time</Text>
                        </TouchableOpacity>

                        {timeCards.length > 0 && (
                            <FlatList
                                data={timeCards}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderTimeCard}
                                numColumns={1}
                                contentContainerStyle={styles.timeCardContainer}
                                scrollEnabled={false}
                            />
                        )}
                    </>
                )}

                {showDatePicker && (
                    <View>
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={handleDateChange}
                        />
                        {Platform.OS === 'ios' && (
                            <View style={styles.iconWrapper}>
                                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.iconButton}>
                                    <Ionicons name="time" size={30} color="#4CAF50" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCancelDate} style={styles.iconButton}>
                                    <Ionicons name="close-circle" size={30} color="#C57575" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {showTimePicker && (
                    <View>
                        <DateTimePicker
                            value={selectedDate}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                        {Platform.OS === 'ios' && (
                            <TouchableOpacity onPress={() => handleAddTime(selectedDate)} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>Confirm Time</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={handleSave}>
                    Save
                </PrimaryButton>
            </View>
        </ScrollView>
    );
};

export default AddMedicationScreen;

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
        height: 40,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
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
        margin: 8,
        flex: 1,
    },
    timeText: {
        fontSize: 14,
        color: '#333',
    },
    errorLabel: {
        color: 'red',
    },
    inputLabel: {
        marginBottom: 4,
    },
    iconWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    iconButton: {
        padding: 10,
    },
});
