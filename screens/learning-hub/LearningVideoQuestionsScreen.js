import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import PrimaryButton from "../../components/buttons/PrimaryButton";

// Sample Question Data
const questions = [
    {
        id: "1",
        question: "What is the main cause of stroke?",
        options: [
            { id: "1", text: "High Blood Pressure", isCorrect: true },
            { id: "2", text: "Lack of Sleep", isCorrect: false },
            { id: "3", text: "Eating Fruits", isCorrect: false },
            { id: "4", text: "Drinking Water", isCorrect: false }
        ]
    },
    {
        id: "2",
        question: "Which part of the brain is affected by a stroke?",
        options: [
            { id: "1", text: "Heart", isCorrect: false },
            { id: "2", text: "Lungs", isCorrect: false },
            { id: "3", text: "Brain", isCorrect: true },
            { id: "4", text: "Kidneys", isCorrect: false }
        ]
    },
    {
        id: "3",
        question: "What do you need to do in the morning?",
        options: [
            { id: "1", text: "Pray", isCorrect: false },
            { id: "2", text: "Eat", isCorrect: false },
            { id: "3", text: "Brush", isCorrect: true },
            { id: "4", text: "Kiss", isCorrect: false }
        ]
    }
];

const LearningVideoQuestionsScreen = () => {
    const [selectedAnswers, setSelectedAnswers] = useState({}); 

    const handleSelect = (questionId, optionId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={questions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>{item.question}</Text>
                        {item.options.map((option) => (
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
                                    {option.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            <PrimaryButton title="Submit Answers" onPress={() => console.log("User selected:", selectedAnswers)} >Submit</PrimaryButton>
        </View>
    );
};

export default LearningVideoQuestionsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        marginTop: 100,
        marginHorizontal:12,
    },
    questionContainer: {
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    option: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
    selectedOption: {
        backgroundColor: "#C57575",
    },
    selectedOptionText: {
        color: "white",
        fontWeight: "bold",
    },
});
