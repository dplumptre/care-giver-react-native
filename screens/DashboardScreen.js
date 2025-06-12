import { View, Text, StyleSheet, FlatList } from "react-native";
import { SEGMENTS } from "../data/dummy";
import SegmentGrid from "../components/SegmentGrid";
import IconButton from "../components/buttons/IconButton";
import { useCallback, useContext, useEffect, useState } from "react";
import { authContext } from "../store/auth-context";
import axios from "axios";
import { urlA } from "../constant/konst";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const DashboardScreen = ({ navigation }) => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingResult, setIsLoadingResult] = useState(true);
  const [isLoadingStars, setIsLoadingStars] = useState(true);

  const redirect = (screen) => {
    navigation.navigate(screen);
  };

  const [name, setName] = useState("");
  const [result, setResult] = useState({
    currentLevel: 0,
    reward: "Unranked",
    levels: 0,
  });

  const [starsAndReward, setStarsAndReward] = useState({
    patientStars: 0,
    carerStars: 0,
    homeSetupStars: 0,
    medicalStars: 0,
    medicalAdherenceBadge: "",
  });

  const authCtx = useContext(authContext);

  useEffect(() => {
    setIsLoadingUser(true);
    axios
      .get(`${urlA}/auth/user`, {
        headers: {
          Authorization: "Bearer " + authCtx.token,
        },
      })
      .then((response) => {
        setName(response.data.name);
      })
      .catch((error) => {
        console.log("Error fetching user:", error.response?.data || error.message);
      })
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, [authCtx.token]);

  useFocusEffect(
    useCallback(() => {
      setIsLoadingResult(true);
      axios
        .get(`${urlA}/learning-hub-progress/user/result`, {
          headers: {
            Authorization: "Bearer " + authCtx.token,
          },
        })
        .then((response) => {
          setResult(response.data.data);
        })
        .catch((error) => {
          console.log("Error fetching result:", error.response?.data || error.message);
        })
        .finally(() => {
          setIsLoadingResult(false);
        });
    }, [authCtx.token])
  );

  useFocusEffect(
    useCallback(() => {
      setIsLoadingStars(true);
      axios
        .get(`${urlA}/status/result`, {
          headers: {
            Authorization: "Bearer " + authCtx.token,
          },
        })
        .then((response) => {
          setStarsAndReward(response.data.data);
        })
        .catch((error) => {
          console.log("Error fetching stars and result:", error.response?.data || error.message);
        })
        .finally(() => {
          setIsLoadingStars(false);
        });
    }, [authCtx.token])
  );

  function renderSegmentItem(itemData) {
    return (
      <SegmentGrid
        title={itemData.item.title}
        icon={itemData.item.icon}
        id={itemData.item.id}
        color={itemData.item.color}
        redirect={() => redirect(itemData.item.screen)}
      />
    );
  }

  return (
    <View style={styles.mainContainer}>
    {/* Updated Greetings Section */}
    <View style={styles.greetings}>
      <Text style={styles.hello}>
        Hi <Text style={styles.name}>{isLoadingUser ? "Loading..." : name}</Text>,
      </Text>
      <Text style={styles.tagline}>
        Your CareNest journey begins here. Earn badges, build skills, and become a care hero.
      </Text>
    </View>

      {/* Statuses Section */}
      <View style={styles.statusesCard}>
  <View style={styles.statusesGrid}>
    {/* Learning Hub */}
    <View style={styles.statusItem}>
      <View style={styles.iconWrapperSmall}>
        <IconButton name="school" size={16} color="#FFFFFF" />
      </View>
      <View>
        <Text style={styles.statusTitleSmall}>Learning Hub</Text>
        <Text style={styles.statusValueSmall}>
          {isLoadingResult ? "Loading..." : `${result.reward} Badge`}
        </Text>
      </View>
    </View>

    {/* Home Setup Stars */}
    <View style={styles.statusItem}>
      <View style={styles.iconWrapperSmall}>
        <IconButton name="home" size={16} color="#FFFFFF" />
      </View>
      <View>
        <Text style={styles.statusTitleSmall}>Home Setup Stars</Text>
        <Text style={styles.statusValueSmall}>
          {isLoadingStars ? "Loading..." : starsAndReward.homeSetupStars}
        </Text>
      </View>
    </View>

    {/* Carer */}
    <View style={styles.statusItem}>
      <View style={styles.iconWrapperSmall}>
        <FontAwesome5 name="star" size={16} color="#FFFFFF" />
      </View>
      <View>
        <Text style={styles.statusTitleSmall}>Carer</Text>
        <Text style={styles.statusValueSmall}>
          {isLoadingStars ? "Loading..." : starsAndReward.carerStars}
        </Text>
      </View>
    </View>

    {/* Patient */}
    <View style={styles.statusItem}>
      <View style={styles.iconWrapperSmall}>
        <FontAwesome5 name="star" size={16} color="#FFFFFF" />
      </View>
      <View>
        <Text style={styles.statusTitleSmall}>Patient</Text>
        <Text style={styles.statusValueSmall}>
          {isLoadingStars ? "Loading..." : starsAndReward.patientStars}
        </Text>
      </View>
    </View>

    {/* Medical Adherence */}
    <View style={styles.statusItem}>
      <View style={styles.iconWrapperSmall}>
        <FontAwesome5 name="briefcase-medical" size={16} color="#FFFFFF" />
      </View>
      <View>
        <Text style={styles.statusTitleSmall}>Medical Adherence</Text>
        <Text style={styles.statusValueSmall}>
          {isLoadingStars ? "Loading..." : starsAndReward.medicalAdherenceBadge}
        </Text>
      </View>
    </View>
  </View>
</View>

      {/* Segments Section */}
      <FlatList
        data={SEGMENTS}
        keyExtractor={(item) => item.id}
        renderItem={renderSegmentItem}
        numColumns={2}
        contentContainerStyle={styles.segments}
      />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  greetings: {
    marginBottom: 16,
    alignItems: "flex-start", // Align text to the left
  },
  hello: {
    color: "#522E2E", // Dark brown for primary text
    fontSize: 22, // Slightly larger font for emphasis
    fontWeight: "bold",
  },
  name: {
    color: "#C57575", // Complementary red for the user's name
    fontWeight: "bold",
  },
  tagline: {
    color: "#522E2E", // Dark brown for secondary text
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22, // Add spacing for readability
  },
  statusesCard: {
    backgroundColor: "#C57575", // Card background color
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  statusesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusItem: {
    width: "48%", // Two items per row
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrapperSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#522E2E", // Icon background color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statusTitleSmall: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF", // White text for contrast
  },
  statusValueSmall: {
    fontSize: 10,
    color: "#FDE6D0", // Light beige for secondary text
    fontWeight: "bold",
  },
  segments: {
    paddingTop: 16,
  },
});