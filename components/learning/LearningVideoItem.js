import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import IconButton from "../buttons/IconButton";







const LearningVideoItem = ({id,text,onView}) => (


<View>

  <Pressable 
    pointerEvents="box-only"
    android_ripple={{ color: '#E0E0E0' }} 
    style={({ pressed }) => [
      styles.listItemContainer,
      Platform.OS === 'ios' && pressed ? styles.pressedItem : null
    ]}
    onPress={()=>onView(id) }
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
    <View style={styles.text1}>
      <IconButton name="logo-youtube" size={23} color='#C57575' />
    </View>
    <View style={styles.textWrapper}>
      <Text style={styles.text2}>{text}</Text>
    </View>
    <View style={styles.text3}>
      <IconButton name="chevron-forward-sharp" size={24} color="#DDD" />
    </View>
  </View>
  </Pressable>




</View>




);

export default LearningVideoItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8, 
    // backgroundColor: '#ffffff',



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
