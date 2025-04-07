import { Pressable, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const IconButton = ({ name, size, color, onPressHandler, drawer = false }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (drawer) {
      console.log('Manually opening the drawer');
      navigation.dispatch(DrawerActions.closeDrawer()); // Close first (if open)
      setTimeout(() => {
        navigation.dispatch(DrawerActions.openDrawer()); // Open the drawer
      }, 100); // Slight delay before toggling open again
    } else if (onPressHandler) {
      onPressHandler();
    }
  };
  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [pressed && styles.pressed]}>
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
