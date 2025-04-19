import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useContext, useEffect, useState } from "react";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { authContext } from "../../store/auth-context";
import { urlA } from "../../constant/konst";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

const LearningVideoQuestionsScreen = ({ navigation }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const route = useRoute();
    const { videoId, title } = route.params;
    const authCtx = useContext(authContext);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {


        navigation.setOptions({
            title: title
        })
        setIsLoading(true);
        async function getQuestions() {
            try {
                const response = await axios.get(`${urlA}/questions/video/${videoId}`, {
                    headers: {
                        Authorization: "Bearer " + authCtx.token,
                    },
                });
                const res = response.data.data;
                setQuestions(res);
            } catch (error) {
                console.error("Error fetching questions", error);
                Alert.alert(
                    "Error",
                    "Failed to load video details. Please try again later.",
                    [{ text: "OK" }]
                );
            } finally {
                setIsLoading(false);
            }
        }
        getQuestions();
    }, [videoId, authCtx.token]);




    const handleSelect = (questionId, optionId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };


    const allQuestionsAnswered = questions.length > 0 && questions.every((question) => selectedAnswers[question.id]);

    const calculateScore = () => {
        let correctCount = 0;

        questions.forEach((question) => {
            const selectedOptionId = selectedAnswers[question.id];
            const correctOption = question.answerOptionList.find(opt => opt.isCorrect);
            if (selectedOptionId === correctOption?.id) {
                correctCount += 1;
            }
        });
        const totalQuestions = questions.length;
        const scorePercentage = (correctCount / totalQuestions);

        return {
            correctCount,
            totalQuestions,
            scorePercentage
        };
    };




    const onSubmit = async () => {
        setIsLoading(true);
        const result = calculateScore();

        const isSuccessful = result.correctCount === result.totalQuestions;

        if (isSuccessful) {
            try {
                const resp = await axios.post(
                    `${urlA}/learning-hub-progress/user`,
                    {
                        isSuccessful: isSuccessful,
                        score: result.scorePercentage, 
                        videoId: videoId,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + authCtx.token,
                        },
                    }
                );
                const data = resp.data;
                console.log("Progress saved:", data);

                // Navigate or show a result modal
                // navigation.navigate("SuccessScreen", { score: result.scorePercentage });
            } catch (error) {
                console.error("Failed to submit progress:", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        setIsLoading(false);
        console.log("User selected:", selectedAnswers);
        console.log(`Score: ${result.correctCount} out of ${result.totalQuestions}`);
        console.log(`Percentage: ${result.scorePercentage * 100}%`);
        navigation.reset({
            index: 0,
            routes: [
              {
                name: "LearningResult",
                params: {
                  score: result.scorePercentage,
                  isSuccessful: isSuccessful,
                },
              },
            ],
          });
          
    }


    if (isLoading) {
        return <LoadingOverlay message="loading questions..." />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={questions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>{item.question}</Text>
                        {item.answerOptionList.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.option,
                                    selectedAnswers[item.id] === option.id ? styles.selectedOption : null
                                ]}
                                onPress={() => handleSelect(item.id, option.id)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedAnswers[item.id] === option.id ? styles.selectedOptionText : null
                                    ]}
                                >
                                    {option.answerOption}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            <PrimaryButton
                onPress={onSubmit}
                disabled={!allQuestionsAnswered}
                style={[!allQuestionsAnswered ? styles.blurredButton : null]}
            >
                Submit Answers
            </PrimaryButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    questionContainer: {
        marginBottom: 20,
    },
    question: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    option: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        marginBottom: 10,
    },
    optionText: {
        fontSize: 14,
        color: "#333",
    },
    selectedOption: {
        backgroundColor: "#C57575",
    },
    selectedOptionText: {
        color: "white",
        fontWeight: "bold",
    },
    blurredButton: {
        opacity: 0.5, // Apply blur effect by reducing opacity
    },
});

export default LearningVideoQuestionsScreen;
