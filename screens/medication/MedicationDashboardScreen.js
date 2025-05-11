import React, { useContext, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MedicationItem from '../../components/medication/medicationItem';
import IconButton from '../../components/buttons/IconButton';
import { urlA } from '../../constant/konst';
import { authContext } from '../../store/auth-context';
import axios from 'axios';

const MedicationDashboardScreen = ({ navigation }) => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [medications, setMedications] = useState([]);
    const [patientList, setPatientList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rewards, setRewards] = useState(null); // State to store rewards data
    const authCtx = useContext(authContext);

    // Fetch patients on component mount
    useLayoutEffect(() => {
        setIsLoading(true);
        const getPatients = async () => {
            try {
                const response = await axios.get(`${urlA}/patients`, {
                    headers: {
                        Authorization: 'Bearer ' + authCtx.token,
                    },
                });
                setPatientList(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getPatients();
    }, [authCtx.token]);


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


    const onViewHandler = (item) => {



      const dosageTimes = (item.dosageTimes || [])
        .map((dt) => {
          const datetime = new Date(dt.time);
          const formattedDate = datetime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }); // e.g., May 2, 2025
          const formattedTime = datetime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }); // e.g., 08:30 AM
          return `• ${formattedDate} at ${formattedTime}`;
        })
        .join('\n');
  
      const message = `Dosage: ${item.dosage}\n\n${dosageTimes || 'No dosage times set.'}`;
  
      Alert.alert(
        'Details',
        message,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Edit',
            onPress: () =>
              navigation.navigate('EditMedication', {
                medicationId: item.id,
                name: item.drugName,
              }),
          },
        ],
        { cancelable: true }
      );
    }
  

    // Fetch medications and rewards when a patient is selected
    const handlePatientSelect = async (patientId) => {
        setSelectedPatient(patientId);

        if (patientId !== '') {
            try {
                setIsLoading(true);

                // Fetch medications
                const medicationResp = await axios.get(`${urlA}/medications/patients/${patientId}`, {
                    headers: {
                        Authorization: 'Bearer ' + authCtx.token,
                    },
                });
                setMedications(medicationResp.data.data);

                // Fetch rewards
                const rewardsResp = await axios.get(`${urlA}/medications/result/${patientId}`, {
                    headers: {
                        Authorization: 'Bearer ' + authCtx.token,
                    },
                });
                setRewards(rewardsResp.data.data); // Update rewards state
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch patient data.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderMedicationItem = ({ item }) => (
        <MedicationItem item={item} onView={onViewHandler} />
    );

    const renderBadges = () => {
        if (!rewards || !rewards.earnedBadges || rewards.earnedBadges.length === 0) {
            return <Text style={styles.noBadgesText}>No badges earned yet.</Text>;
        }

        return rewards.earnedBadges.map((badge) => (
            <View key={badge.id} style={styles.badgeContainer}>
                <FontAwesome5 name={badge.icon} size={24} color="#fff" style={styles.badgeIcon} />
                <Text style={styles.badgeText}>{badge.name}</Text>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            {/* Status Card */}
            <View style={styles.statusCard}>
                <Text style={styles.statusText}>Medication Dashboard</Text>
                <Text style={styles.statusSubText}>Manage medications for your patients</Text>

                {/* Rewards Section */}
                {rewards && (
                    <View style={styles.rewardsContainer}>
                        <View style={styles.rewardsRow}>
                            <View style={styles.rewardItem}>
                                <FontAwesome5 name="star" size={20} color="#FFD700" />
                                <Text style={styles.rewardText}>{rewards.points}</Text>
                            </View>
                            <View style={styles.rewardItem}>
                                <FontAwesome5 name="fire" size={20} color="#FF4500" />
                                <Text style={styles.rewardText}>{rewards.currentStreak} days</Text>
                            </View>
                            <View style={styles.rewardItem}>
                                <FontAwesome5 name="trophy" size={20} color="#FFD700" />
                                <Text style={styles.rewardText}>{rewards.longestStreak} days</Text>
                            </View>
                        </View>

                        {/* Badges Section */}
                        <Text style={styles.badgesTitle}>Earned Badges:</Text>
                        {renderBadges()}
                    </View>
                )}
            </View>

            {/* Patient Picker */}
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedPatient}
                    onValueChange={(itemValue) => handlePatientSelect(itemValue)}
                    style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
                    mode="dropdown"
                >
                    <Picker.Item label="-- Select Patient --" value="" />
                    {patientList.map((patient) => (
                        <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
                    ))}
                </Picker>
            </View>

            {/* Medication List */}
            {selectedPatient ? (
                <FlatList
                    data={medications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMedicationItem}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={true}
                    style={{ flex: 1 }}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.infoText}>Please select a patient to view medications</Text>
                </View>
            )}
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
    rewardsContainer: {
        marginTop: 16,
    },
    rewardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 8,
    },
    badgesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    badgeIcon: {
        marginRight: 8,
    },
    badgeText: {
        fontSize: 14,
        color: '#fff',
    },
    noBadgesText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 8,
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
    flatListContent: {
        paddingBottom: 120,
    },
    infoText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});