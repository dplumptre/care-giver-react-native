import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import IconButton from "./buttons/IconButton";



const PatientItem = ({ onView, text, id, onEdit }) => (
    <View style={styles.listItemContainer}>
      <Pressable 
        android_ripple={{ color: '#E0E0E0' }} 
        style={({ pressed }) => [
          styles.textWrapper,
          Platform.OS === 'ios' && pressed ? styles.pressedItem : null
        ]}
        onPress={onView.bind(this, id)}
      >
        <Text style={styles.text2}>{text}</Text>
      </Pressable>
  
      {/* Edit icon also triggers the onView */}
      <Pressable onPress={onView.bind(this, id)} style={styles.iconWrapper}>
        <IconButton name="create" size={24} color="#ccc" onPressHandler={onView.bind(this, id)} />
      </Pressable>
    </View>
  );
export default PatientItem;

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
      textWrapper: {
        flex: 1,
        justifyContent: 'center',
      },
      iconWrapper: {
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
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
