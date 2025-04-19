import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from "axios";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import SegmentGrid from "../../components/SegmentGrid";
import { EXERCISE_SEGMENTS } from "../../data/dummy";

const ExerciseDashboardScreen = ({ navigation }) => {
    const [summary, setSummary] = useState({
        patientStars: 0,
        carerStars: 0,
        patientStreak: "No streaks yet.",
        carerStreak: "No streaks yet.",
    });

    const authCtx = useContext(authContext);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const response = await axios.get(`${urlA}/exercise-session/result`, {
                    headers: { Authorization: "Bearer " + authCtx.token },
                });

                const data = response.data.data;

                // Extract the first streak for patient and carer
                const firstPatientStreak = Object.values(data.patientStreaks)[0] || "No streaks yet.";
                const firstCarerStreak = Object.values(data.carerStreaks)[0] || "No streaks yet.";

                setSummary({
                    patientStars: data.patientStars,
                    carerStars: data.carerStars,
                    patientStreak: firstPatientStreak,
                    carerStreak: firstCarerStreak,
                });
            } catch (error) {
                console.error("Error fetching summary:", error);
            }
        }

        fetchSummary();
    }, [authCtx.token]);

    const redirect = (itemData) => {
        navigation.navigate(itemData.item.screen, { myparams: itemData.item.id });
    };

    function renderSegmentItem(itemData) {
        return (
            <SegmentGrid
                title={itemData.item.title}
                icon={itemData.item.icon}
                id={itemData.item.id}
                color={itemData.item.color}
                redirect={() => redirect(itemData)}
            />
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.statuses}>
                <View style={styles.statusTop}>
                    <View style={styles.statusItem}>
                        <FontAwesome5 name="user-injured" size={16} color="#FDE6D0" style={{ marginRight: 4 }} />
                        <Text style={styles.statusTextWhite}>Earned:</Text>
                        <Text style={styles.statusTextYellow}>{summary.patientStars}</Text>
                        <FontAwesome5 name="star" size={14} color="#FFD700" style={{ marginLeft: 4 }} />
                    </View>

                    <View style={styles.statusItem}>
                        <FontAwesome5 name="user-injured" size={16} color="#FDE6D0" style={{ marginRight: 4 }} />
                        <Text style={styles.statusTextWhite}>Streak:</Text>
                        <Text style={styles.statusTextYellow}>{summary.patientStreak}</Text>
                    </View>
                </View>

                <View style={styles.statusTop}>
                    <View style={styles.statusItem}>
                        <FontAwesome5 name="user-nurse" size={16} color="#FDE6D0" style={{ marginRight: 4 }} />
                        <Text style={styles.statusTextWhite}>Earned:</Text>
                        <Text style={styles.statusTextYellow}>{summary.carerStars}</Text>
                        <FontAwesome5 name="star" size={14} color="#FFD700" style={{ marginLeft: 4 }} />
                    </View>

                    <View style={styles.statusItem}>
                        <FontAwesome5 name="user-nurse" size={16} color="#FDE6D0" style={{ marginRight: 4 }} />
                        <Text style={styles.statusTextWhite}>Streak:</Text>
                        <Text style={styles.statusTextYellow}>{summary.carerStreak}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.greetings}>
                <Text style={styles.hello}>Select Role</Text>
            </View>

            <View style={styles.segments}>
                <FlatList
                    data={EXERCISE_SEGMENTS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSegmentItem}
                    numColumns={2}
                />
            </View>
        </View>
    );
};

export default ExerciseDashboardScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
    },
    greetings: {
        flex: 0.5,
        margin: 12,
    },
    hello: {
        color: '#522E2E',
        fontSize: 23,
    },
    statuses: {
        flex: 0.7,
        backgroundColor: '#C57575',
        padding: 10,
        borderRadius: 6,
        margin: 12,
    },
    statusTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    statusTextWhite: {
        color: '#FFFFFF',
        fontSize: 14,
        marginRight: 4,
    },
    statusTextYellow: {
        color: '#FFFACD',
        fontWeight: 'bold',
        fontSize: 14,
    },
    segments: {
        flex: 6,
    },
});