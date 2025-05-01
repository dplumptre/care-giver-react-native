import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import IconButton from "../buttons/IconButton";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';




const MedicationItem = ({id,name,onView}) => {

  
  return (<Pressable 
    android_ripple={{ color: '#E0E0E0' }} 
    style={({ pressed }) => [
      styles.listItemContainer,
      Platform.OS === 'ios' && pressed ? styles.pressedItem : null
    ]}
    onPress={onView.bind(this, id)}
  >
    <Text style={styles.text1}>
    <FontAwesome5 name="syringe" size={20} color="#C57575" style={styles.iconLeft} />
    </Text>
    <View style={styles.textWrapper}>
      <Text style={styles.text2}>{name}</Text>
    </View>
    <Text style={styles.text3}>
      <IconButton name="chevron-forward-sharp" size={24} color="#DDD" />
    </Text>
  </Pressable>
)};

export default MedicationItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8, 
    backgroundColor: '#ffffff',


    borderWidth: 1,
    borderColor: '#DDD',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  pressedItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light grey on press (for iOS)
  },
  textWrapper: {
    flex: 7,
    justifyContent: 'center',
  },
  text1: {
    flex: 1,
    fontSize: 18,
    textAlign: 'left', 
  },
  text2: {
    fontSize: 16,
    lineHeight: 24, 
    textAlignVertical: 'center',
    flexShrink: 1, 
  },
  text3: {
    flex: 0.5,
    fontSize: 18,
    textAlign: 'right', 
  },
});
