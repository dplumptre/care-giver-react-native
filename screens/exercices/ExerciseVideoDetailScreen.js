import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Platform, Alert, TouchableOpacity,ScrollView } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { Picker } from "@react-native-picker/picker";
import { WebView } from "react-native-webview";
import axios from "axios";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

const ExerciseVideoDetailScreen = ({ route, navigation }) => {
  const { videoId } = route.params;
  const [video, setVideo] = useState(null);
  const [webViewError, setWebViewError] = useState(null);
  const [patientList, setPatientList] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [payload, setPayload] = useState({
    patientId: null,
    videoId: videoId ?? null,
    careGiver: true,
  });

  const authCtx = useContext(authContext);

  const isCarerExercise = video?.videoType === "CARER_EXERCISE";

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
        console.log("Error fetching video details:", error);
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
        console.log("Error fetching patients:", error);
        Alert.alert("Error", "Failed to load patients.", [{ text: "OK" }]);
      }
    }

    fetchPatients();
  }, [authCtx.token]);

  const onChangeText = (key, value) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
    if (key === "patientId") {
      setValidationError(false);
    }
  };


  const onRedirect = () => navigation.navigate("PatientModule", { screen: "AddPatient" })

  const onSubmit = async () => {
    const { patientId, videoId, careGiver } = payload;

    if (!isCarerExercise && !patientId) {
      setValidationError(true);
      return;
    }

    Alert.alert("Confirm", "Mark this exercise as completed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await axios.post(
              `${urlA}/exercise-session/complete${patientId ? `?patientId=${patientId}` : ""}`,
              { videoId, careGiver },
              { headers: { Authorization: "Bearer " + authCtx.token } }
            );

            const resultResponse = await axios.get(`${urlA}/exercise-session/result`, {
              headers: { Authorization: "Bearer " + authCtx.token },
            });

            const resultData = resultResponse.data.data;

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "ExerciseResult",
                  params: {
                    patientStars: resultData.patientStars,
                    carerStars: resultData.carerStars,
                    patientStreaks: resultData.patientStreaks,
                    carerStreaks: resultData.carerStreaks,
                  },
                },
              ],
            });
          } catch (error) {
            console.log("Error during submission or fetching result:", error?.response?.data || error);
            Alert.alert("Error", "Failed to complete exercise or fetch result.", [{ text: "OK" }]);
          }
        },
      },
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
            originWhitelist={["*"]}
            onError={(event) => setWebViewError(event.nativeEvent)}
            allowsFullscreenVideo
            useWebKit
            javaScriptEnabled
            style={{ flex: 1 }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            scrollEnabled={false}
          />
        ) : (
          <LoadingOverlay message="Loading video..." />
        )}
        {webViewError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>WebView Error:</Text>
            <Text>{webViewError.description || webViewError.message || "No details available."}</Text>
          </View>
        )}
      </View>

       {/* Title Outside ScrollView */}
       <Text style={styles.title}>{video?.title}</Text>

{/* Scrollable Content */}
<ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
  <Text style={styles.description}>{video?.description}</Text>
</ScrollView>

      {!isCarerExercise && patientList.length === 0 ? (
        <View style={styles.noPatientsContainer}>
          <Text style={styles.noPatientsText}>No Patient created yet! :(</Text>
          <PrimaryButton style={{ backgroundColor: "#522E2E" }} onPress={onRedirect}>
            Add a patient to start
          </PrimaryButton>
        </View>
      ) : (
        <>
          {!isCarerExercise && (
            <>
              <Picker
                selectedValue={payload.patientId}
                onValueChange={(val) => onChangeText("patientId", val)}
                style={[styles.picker, Platform.OS === "ios" && styles.iosPicker]}
              >
                <Picker.Item label="Select Patient" value={null} />
                {patientList.map((item) => (
                  <Picker.Item key={item.id} label={item.name} value={item.id} />
                ))}
              </Picker>
            </>
          )}

          <View style={styles.buttonContainer}>
            <PrimaryButton style={{ backgroundColor: "#522E2E" }} onPress={onSubmit}>
              I've Completed this Exercise
            </PrimaryButton>
          </View>
        </>
      )}
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
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  noPatientsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPatientsText: {
    fontSize: 16,
    color: "#522E2E",
    marginBottom: 8,
  },
  addPatientLink: {
    fontSize: 16,
    color: "#C57575",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flex: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: "#ffe0e0",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    marginTop: 2,
    backgroundColor: "#f0f0f0",
  },
  iosPicker: {
    height: 150,
  },
});