import { View, Text, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import { WebView } from 'react-native-webview';
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Picker } from '@react-native-picker/picker';

const ExerciseVideoDetailScreen = ({ route, navigation }) => {
    const { videoId } = route.params;
    const [video, setVideo] = useState(null);
    const [webViewError, setWebViewError] = useState(null);
    const [patientList, setPatientList] = useState([]);
    const [validationError, setValidationError] = useState(false);
    const [payload, setPayload] = useState({
        patientId: null,
        videoId: videoId ?? null,
        careGiver: true
    });

    const authCtx = useContext(authContext);

    useEffect(() => {
        async function fetchVideoDetails() {
            try {
                const response = await axios.get(`${urlA}/videos/${videoId}`, {
                    headers: { Authorization: "Bearer " + authCtx.token },
                });
                const data = response.data.data;
                setVideo(data);
                navigation.setOptions({ title: data.title });
            } catch (error) {
                console.error("Error fetching video details:", error);
                Alert.alert("Error", "Failed to load video details.", [{ text: "OK" }]);
            }
        }

        if (videoId) {
            fetchVideoDetails();
        }
    }, [videoId, authCtx.token]);

    useEffect(() => {
        async function fetchPatients() {
            try {
                const response = await axios.get(`${urlA}/patients`, {
                    headers: { Authorization: "Bearer " + authCtx.token },
                });
                setPatientList(response.data.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
                Alert.alert("Error", "Failed to load patients.", [{ text: "OK" }]);
            }
        }

        fetchPatients();
    }, [authCtx.token]);

    useEffect(() => {
        setPayload((prev) => ({
            ...prev,
            careGiver: video?.videoType !== "CARER_EXERCISE",
        }));
    }, [video?.videoType]);

    const onChangeText = (key, value) => {
        setPayload((prev) => ({ ...prev, [key]: value }));
        if (key === "patientId") {
            setValidationError(false);
        }
    };

    const handleWebViewError = (event) => {
        console.error("WebView Error:", event.nativeEvent);
        setWebViewError(event.nativeEvent);
        Alert.alert("WebView Error", event.nativeEvent.description, [{ text: "OK" }]);
    };

    const handleWebViewHttpError = (event) => {
        console.error("WebView HTTP Error:", event.nativeEvent);
        setWebViewError(event.nativeEvent);
        Alert.alert("HTTP Error", `Status: ${event.nativeEvent.statusCode}`, [{ text: "OK" }]);
    };

    const handleWebViewLoad = () => {
        console.log("WebView loaded successfully.");
    };

    const onSubmit = async () => {
        const { patientId, videoId, careGiver } = payload;

        if (video?.videoType !== "CARER_EXERCISE" && !patientId) {
            setValidationError(true);
            return;
        }

        console.log(patientId, videoId, careGiver);
        Alert.alert("Confirm", "Mark this exercise as completed?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Yes",
                onPress: async () => {
                    try {
                        await axios.post(
                          `${urlA}/exercise-session/complete${patientId ? `?patientId=${patientId}` : ''}`, 
                          {
                            videoId,
                            careGiver
                          }, 
                          {
                            headers: {
                              Authorization: "Bearer " + authCtx.token
                            }
                          }
                        );
                      
                        Alert.alert("Success", "Exercise marked as completed.", [
                          {
                            text: "OK",
                            onPress: () => navigation.navigate("Dashboard")
                          }
                        ]);
                      } catch (error) {
                        console.error("Submission failed:", error?.response?.data || error);
                        Alert.alert("Error", "Failed to mark as completed.", [{ text: "OK" }]);
                      }
                      
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                {video?.link ? (
                    <WebView
                        source={{
                            uri: `https://test.overallheuristic.com/video.html?videoId=${video.link}`,
                        }}
                        originWhitelist={['*']}
                        onError={handleWebViewError}
                        onHttpError={handleWebViewHttpError}
                        onLoad={handleWebViewLoad}
                        allowsFullscreenVideo
                        useWebKit
                        javaScriptEnabled
                        style={{ flex: 1 }}
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false}
                        scrollEnabled={false}
                    />
                ) : (
                    <LoadingOverlay message="loading video..." />
                )}
                {webViewError && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>WebView Error:</Text>
                        <Text>{webViewError.description || webViewError.message || 'No details available.'}</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{video?.title}</Text>
                <Text style={styles.description}>{video?.description}</Text>
            </View>
            {validationError && (
                        <Text style={{ color: 'red', marginTop: 4 }}>Please select a patient</Text>
                    )}

            {video?.videoType !== "CARER_EXERCISE" && (
                <>
                    <Picker
                        selectedValue={payload.patientId}
                        onValueChange={(val) => onChangeText('patientId', val)}
                        style={[styles.picker, Platform.OS === 'ios' && styles.iosPicker]}
                    >
                        <Picker.Item label="Select Patient" value={null} />
                        {patientList.map((item) => (
                            <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                    </Picker>
              
                </>
            )}

            <View style={styles.buttonContainer}>
                <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={onSubmit}>
                    Completed
                </PrimaryButton>
            </View>
        </View>
    );
};

export default ExerciseVideoDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 12,
        paddingHorizontal: 20,
    },
    videoContainer: {
        marginTop: 50,
        alignItems: "stretch",
        height: 270,
    },
    content: {
        flex: 0.4,
        backgroundColor: "#F5F5F5",
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonContainer: {
        flex: 0.6,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    errorContainer: {
        backgroundColor: '#ffe0e0',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    picker: {
        marginTop: 10,
        backgroundColor: '#f0f0f0',
    },
    iosPicker: {
        height: 150,
    }
});
