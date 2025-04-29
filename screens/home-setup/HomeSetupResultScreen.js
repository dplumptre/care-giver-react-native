import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const HomeSetupResultScreen = ({ route, navigation }) => {
    const { patientName } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎉 Congratulations! 🎉</Text>
            <Text style={styles.subtitle}>
                You have successfully completed the home setup for {patientName}!
            </Text>

            <View style={styles.resultContainer}>
                <Text style={styles.resultText}>You've earned a new star:</Text>
                <View style={styles.starsContainer}>
                    <FontAwesome5 name="star" size={40} color="#FFD700" />
                </View>
                <Text style={styles.motivationText}>
                    Keep up the amazing work! Your dedication is making a difference. 💪
                </Text>
            </View>

            <PrimaryButton
                style={styles.button}
                onPress={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeSetupModule' }],
                    })
                }
            >
                Back to Home Setup
            </PrimaryButton>
        </View>
    );
};

export default HomeSetupResultScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#C57575',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#555',
        marginBottom: 16,
        textAlign: 'center',
    },
    resultContainer: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    motivationText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#777',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#522E2E',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
});