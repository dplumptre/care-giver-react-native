import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';

function PrimaryButton({ children, onPress }) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: '#4C2929' }}
        style={({ pressed }) => [
          styles.buttonInnerContainer,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    margin: 4,
    borderRadius: 6,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  buttonInnerContainer: {
    backgroundColor: '#522E2E',
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
    borderRadius: 6,
  },
  pressed: {
    opacity: 0.75, // iOS visual feedback
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
