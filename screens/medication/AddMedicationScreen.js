import React, { useState } from 'react';
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

const demoPatients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
];

const AddMedicationScreen = ({ navigation }) => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [drugName, setDrugName] = useState('');
    const [dosage, setDosage] = useState('');
    const [timeCards, setTimeCards] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [validationErrors, setValidationErrors] = useState({
        patient: false,
        drugName: false,
        dosage: false,
    });

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

    const handleSave = () => {
        const payload = {
            patientId: selectedPatient,
            drugName,
            dosage,
            times: timeCards.map((t) => t.isoDate),
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

        console.log('Payload:', payload);
        Alert.alert('Success', 'Medication saved successfully!');
        navigation.goBack();
    };

    const renderTimeCard = ({ item }) => (
        <View style={styles.timeCard}>
            <Text style={styles.timeText}>{item.formattedDate}</Text>
            <TouchableOpacity onPress={() => handleDeleteTime(item)}>
                <Ionicons name="trash" size={20} color="#C57575" />
            </TouchableOpacity>
        </View>
    );

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
                        {demoPatients.map((patient) => (
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
