import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MedicationItem from '../../components/medication/medicationItem';
import IconButton from '../../components/buttons/IconButton';

const demoPatients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
];

const demoMedications = {
    '1': [
        { id: '1', name: 'Paracetamol' },
        { id: '2', name: 'Ibuprofen' },
        { id: '3', name: 'Amoxicillin' },
    ],
    '2': [
        { id: '1', name: 'Metformin' },
        { id: '2', name: 'Atorvastatin' },
    ],
    '3': [
        { id: '1', name: 'Aspirin' },
        { id: '2', name: 'Losartan' },
        { id: '3', name: 'Omeprazole' },
    ],
};




const MedicationDashboardScreen = ({ navigation }) => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [medications, setMedications] = useState([]);



    function headerButtonPressHandler(){
        navigation.navigate("AddMedication")
    }
    
      useLayoutEffect(()=>{
        navigation.setOptions({
                headerRight: ()=>{
                  return <IconButton onPressHandler={headerButtonPressHandler} name="add" size={24} color="#522E2E" />
                }
              })
    },[navigation,headerButtonPressHandler])



    const onViewHandler = (id) => {
        Alert.alert(id);
    }

    const handlePatientSelect = (patientId) => {
        setSelectedPatient(patientId);
        setMedications(demoMedications[patientId] || []);
    };

    const renderMedicationItem = ({ item }) => (
        <MedicationItem id={item.id} name={item.name} onView={onViewHandler}/>
    );

    return (
        <View style={styles.container}>
            {/* Status Card */}
            <View style={styles.statusCard}>
                <Text style={styles.statusText}>Medication Dashboard</Text>
                <Text style={styles.statusSubText}>Manage medications for your patients</Text>
            </View>

            {/* Add Medication Icon */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddMedicationScreen')}
            >
                <Ionicons name="add-circle" size={28} color="#C57575" />
            </TouchableOpacity>

            {/* Patient Picker */}
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedPatient}
                    onValueChange={(itemValue) => handlePatientSelect(itemValue)}
                    style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
                    mode="dropdown"
                >
                    <Picker.Item label="-- Select Patient --" value="" />
                    {demoPatients.map((patient) => (
                        <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
                    ))}
                </Picker>
            </View>



     









            {/* Medication List */}
            <View >
                {selectedPatient ? (
                    <FlatList
                        data={medications}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMedicationItem}
                        contentContainerStyle={styles.flatListContent}
                    />
                ) : (
                    <Text style={styles.infoText}>Please select a patient to view medications</Text>
                )}
            </View>
        </View>
    );
};

export default MedicationDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    statusCard: {
        backgroundColor: '#C57575',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    statusSubText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
    },
    addButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
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
    listContainer: {
        flex: 1,
        backgroundColor: '#FDEDEC',
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
    },
    flatListContent: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    iconLeft: {
        marginRight: 12,
    },
    medicationName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    iconRight: {
        marginLeft: 12,
    },
    infoText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
    },
});