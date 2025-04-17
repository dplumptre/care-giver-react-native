import { View, Text, Pressable, StyleSheet } from 'react-native';

function PrimaryButton({ children, onPress, disabled, style }) {
    return (
        <View style={styles.buttonOutterContainer}>
            <Pressable
                style={[styles.buttonInnerContainer, disabled ? styles.disabledButton : null, style]} // Apply the passed style and the disabled style
                onPress={onPress}
                android_ripple={{ color: '#4C2929' }}
                disabled={disabled} // Disable the button's press action
            >
                <Text style={[styles.buttonText, disabled ? styles.disabledButtonText : null]}>
                    {children}
                </Text>
            </Pressable>
        </View>
    );
}

export default PrimaryButton;

const styles = StyleSheet.create({
    buttonOutterContainer: {
        margin: 4,
        overflow: 'hidden',
        borderRadius: 6,
    },
    buttonInnerContainer: {
        backgroundColor: '#522E2E',
        paddingVertical: 14,
        paddingHorizontal: 16,
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    disabledButton: {
        opacity: 0.5,  // Apply blur effect by reducing opacity
    },
    disabledButtonText: {
        color: '#d3d3d3', // Change text color to indicate disabled state
    },
});
