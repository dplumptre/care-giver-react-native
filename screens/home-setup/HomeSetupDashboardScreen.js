import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { authContext } from '../../store/auth-context';
import { useContext, useState,useEffect, useCallback } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { urlA } from '../../constant/konst';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const HomeSetupDashboardScreen = ({ navigation }) => {


    const authCtx = useContext(authContext);
    const [stars, setStars] = useState(0);

      useFocusEffect(
        useCallback(() => {
        async function fetchStar() {
            try {
                const response = await axios.get(`${urlA}/home-setup/stars`, {
                    headers: { Authorization: "Bearer " + authCtx.token },
                });
                const data = response.data.data;
                setStars(data);

            } catch (error) {
                console.error("Error fetching star:", error);
            }
        }

        fetchStar();
    }, [authCtx.token])
    );



    const renderStars = (count) => {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push(
                <FontAwesome5
                    key={i}
                    name="star"
                    size={20}
                    color="#FFD700"
                    style={{ marginHorizontal: 2 }}
                />
            );
        }
        return stars;
    };




  const goToCheckList = () => {
    navigation.navigate('HomeSetupCheckList');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.statusText}> Home setup stars earned: {stars}</Text>
        </View >
        <View style={styles.statusItem}>{renderStars(stars)}</View>
      </View>

      <View style={styles.content}>
        <View style={styles.iconHeading}>
          <Ionicons name="home-outline" size={24} color="#522E2E" />
          <Text style={styles.heading}>Setting Up a Stroke-Friendly Home</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconSubheading}>
            <Ionicons name="information-circle-outline" size={20} color="#522E2E" />
            <Text style={styles.subheading}>Why Home Setup Matters</Text>
          </View>
          <Text style={styles.text}>
            Making small adjustments to the home can significantly improve safety and ease of movement for stroke survivors.
            A well-organized space also ensures they can access essential items more easily.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconSubheading}>
            <Ionicons name="list-circle-outline" size={20} color="#522E2E" />
            <Text style={styles.subheading}>Instructions</Text>
          </View>
          <Text style={styles.bullet}>• Rearrange furniture for clear walking paths</Text>
          <Text style={styles.bullet}>• Place essentials within easy reach</Text>
          <Text style={styles.bullet}>• Add non-slip mats in the bathroom</Text>
          <Text style={styles.bullet}>• Ensure proper lighting in hallways and rooms</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton style={{ backgroundColor: '#522E2E' }} onPress={goToCheckList}>
          Get Started
        </PrimaryButton>
      </View>
    </View>
  );
};

export default HomeSetupDashboardScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  statusContainer: {
    backgroundColor: '#C57575',
    padding: 10,
    borderRadius: 6,
    marginVertical: 12,
  },
  content: {
    flex: 0.9,
    marginHorizontal: 8,
  },
  iconHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#522E2E',
    marginLeft: 10,
    marginTop: 15,
  },
  iconSubheading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#522E2E',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#FDEDEC',
    padding: 12,
    borderRadius: 10,
    marginVertical: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  bullet: {
    fontSize: 16,
    marginVertical: 4,
    marginLeft: 12,
    color: '#333',
  },
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Add spacing between the text and stars
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensures stars wrap to the next line
    justifyContent: 'flex-start', // Align stars to the left
    marginTop: 8, // Add spacing above the stars
  },
});
