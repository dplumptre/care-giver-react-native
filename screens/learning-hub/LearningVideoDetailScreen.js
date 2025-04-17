import React, { Text, View, StyleSheet, Button, Alert } from "react-native";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { urlA } from "../../constant/konst";
import { authContext } from "../../store/auth-context";
import { WebView } from 'react-native-webview';
import LoadingOverlay from "../../components/ui/LoadingOverlay";


const LearningVideoDetailScreen = ({navigation}) => {
  const route = useRoute();
  const { videoId } = route.params;
  const [video, setVideo] = useState(null);
  const authCtx = useContext(authContext);
  const [webViewError, setWebViewError] = useState(null);
  const [videoStatus,setVideoStatus] = useState(false);

  useEffect(() => {
    async function getDetail() {
      try {
        console.log("Fetching video details for ID:", videoId);
        const response = await axios.get(`${urlA}/videos/${videoId}`, {
          headers: {
            Authorization: "Bearer " + authCtx.token,
          },
        });
        const vee = response.data.data;
        console.log("Fetched video details:", vee);
        setVideo(vee);
        navigation.setOptions({
            title: vee.title
        })
      } catch (error) {
        console.error("Error fetching video details:", error);
        Alert.alert(
          "Error",
          "Failed to load video details. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }

    if (videoId) {
      getDetail();
    }
  }, [videoId, authCtx.token,navigation]);



   
  useFocusEffect(
    useCallback(() => {
      axios.get(`${urlA}/learning-hub-progress/user/learner-hub-quiz-status/${videoId}`, {
        headers: {
          Authorization: 'Bearer ' + authCtx.token,
        },
      })
      .then((response) => {
        setVideoStatus(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log("Error fetching video status", error.response?.data || error.message);
      });
    }, [authCtx.token])
  );



  const handleWebViewError = (event) => {
    console.error("WebView Error:", event.nativeEvent);
    setWebViewError(event.nativeEvent);
    Alert.alert(
      "WebView Error",
      `Failed to load video. Details: ${event.nativeEvent.description}`,
      [{ text: "OK" }]
    );
  };

  const handleWebViewHttpError = (event) => {
    console.error("WebView HTTP Error:", event.nativeEvent);
    setWebViewError(event.nativeEvent);
    Alert.alert(
      "WebView HTTP Error",
      `HTTP error loading video. Status: ${event.nativeEvent.statusCode}, URL: ${event.nativeEvent.url}`,
      [{ text: "OK" }]
    );
  };

  const handleWebViewLoad = () => {
    console.log("WebView loaded successfully.");
  };


  const goToQuiz =() =>{
        navigation.navigate('LearningVideoQuestions',{videoId:videoId,title:video.title})
  }


  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {video?.link ? (
          <>
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
          </>
        ) : (
          <LoadingOverlay message="loading video..."/>
        )}
        {webViewError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>WebView Error Details:</Text>
            <Text>{webViewError.description || webViewError.message || 'No details available.'}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
       <Text style={styles.title}>{video?.title}</Text>
        <Text style={styles.description}>{video?.description}</Text>

        {videoStatus === true ? (
  <View style={styles.quizCompletedBox}>
    <Text style={styles.quizCompletedText}>🎉 You’ve passed this quiz!</Text>
  </View>
) : (
  <PrimaryButton onPress={goToQuiz}>
    Start Quiz
  </PrimaryButton>
)}


      </View>
    </View>
  );
};

export default LearningVideoDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    paddingHorizontal: 20,
   
  },
  videoContainer: {
    // backgroundColor: "#ccc",
    marginTop: 50,
    alignItems: "stretch", 
    height: 270,
  },
  content: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
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
  },quizCompletedBox: {
    backgroundColor: '#d1f7c4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  
  quizCompletedText: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 16,
  },
  
});