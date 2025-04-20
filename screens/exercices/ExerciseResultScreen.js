import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const ExerciseResultScreen = ({ route, navigation }) => {
    const { patientStars, carerStars, patientStreaks, carerStreaks } = route.params;

    const renderStars = (count) => {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push(
                <FontAwesome5
                    key={i}
                    name="star"
                    size={20}
                    color="#FFD700"
                    style={{ marginHorizontal: 2 }}
                />
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎉 Amazing Job! 🎉</Text>
            <Text style={styles.subtitle}>You've completed the exercise!</Text>

            <View style={styles.resultContainer}>
                <Text style={styles.resultText}>Patient Stars:</Text>
                <View style={styles.starsContainer}>{renderStars(patientStars)}</View>

                <Text style={styles.resultText}>Carer Stars:</Text>
                <View style={styles.starsContainer}>{renderStars(carerStars)}</View>

                <Text style={styles.resultText}>Patient Streaks:</Text>
                {Object.values(patientStreaks).length > 0 ? (
                    Object.values(patientStreaks).map((streak, index) => (
                        <Text key={index} style={styles.streakText}>
                            {streak}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.streakText}>No streaks yet. Keep going!</Text>
                )}

                <Text style={styles.resultText}>Carer Streaks:</Text>
                {Object.values(carerStreaks).length > 0 ? (
                    Object.values(carerStreaks).map((streak, index) => (
                        <Text key={index} style={styles.streakText}>
                            {streak}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.streakText}>No streaks yet. Keep going!</Text>
                )}
            </View>

            <Text style={styles.motivationText}>
                Keep up the great work! You're making amazing progress.
            </Text>

            <PrimaryButton
                style={styles.button}
                onPress={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "ExerciseModule" }],
                    })
                }
            >
                Back to Dashboard
            </PrimaryButton>
          


            
        </View>
    );
};

export default ExerciseResultScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5'
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
        marginBottom: 16,
    },
    resultText: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#666',
    },
    starsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        marginBottom: 16,
    },
    streakText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 16,
        marginBottom: 4,
    },
    motivationText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#777',
        textAlign: 'center',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#522E2E',
     
    },
});