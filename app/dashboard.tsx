import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import ProtectedRoute from "./components/ProtectedRoute";
import i18n from "./i18n";

// card width calculation
const CARD_WIDTH = (Dimensions.get("window").width - 56) / 3;

// department list
const departments = [
  {
    id: "1",
    nameKey: "dashboard.electricity",
    icon: (
      <MaterialCommunityIcons
        name="lightning-bolt-circle"
        size={40}
        color="#fff"
      />
    ),
    color: "#ff9100",
  },
  {
    id: "2",
    nameKey: "dashboard.sanitation",
    icon: (
      <MaterialCommunityIcons name="trash-can" size={40} color="#fff" />
    ),
    color: "#4caf50",
  },
  {
    id: "3",
    nameKey: "dashboard.roads",
    icon: (
      <MaterialCommunityIcons name="car-multiple" size={40} color="#fff" />
    ),
    color: "#1e88e5",
  },
  {
    id: "4",
    nameKey: "dashboard.water",
    icon: (
      <MaterialCommunityIcons name="water-outline" size={40} color="#fff" />
    ),
    color: "#00bcd4",
  },
  {
    id: "5",
    nameKey: "dashboard.parks",
    icon: (
      <MaterialCommunityIcons name="nature-people" size={40} color="#fff" />
    ),
    color: "#388e3c",
  },
  {
    id: "7",
    nameKey: "dashboard.drainage",
    icon: (
      <MaterialCommunityIcons name="pipe-valve" size={40} color="#fff" />
    ),
    color: "#6d4c41",
  },
  {
    id: "8",
    nameKey: "dashboard.streetlights",
    icon: (
      <MaterialCommunityIcons
        name="lightbulb-on-outline"
        size={40}
        color="#fff"
      />
    ),
    color: "#ffca28",
  },
  {
    id: "9",
    nameKey: "dashboard.fireDept",
    icon: (
      <MaterialCommunityIcons name="fire-truck" size={40} color="#fff" />
    ),
    color: "#e53935",
  },
  {
    id: "10",
    nameKey: "dashboard.publicTransport",
    icon: <MaterialCommunityIcons name="bus" size={40} color="#fff" />,
    color: "#009688",
  },
  {
    id: "11",
    nameKey: "dashboard.animalControl",
    icon: <MaterialCommunityIcons name="dog" size={40} color="#fff" />,
    color: "#795548",
  },
  {
    id: "12",
    nameKey: "dashboard.wasteManagement",
    icon: <MaterialCommunityIcons name="recycle" size={40} color="#fff" />,
    color: "#43a047",
  },
  {
    id: "13",
    nameKey: "dashboard.streetVendors",
    icon: <MaterialCommunityIcons name="storefront" size={40} color="#fff" />,
    color: "#f4511e",
  },
  {
    id: "17",
    nameKey: "dashboard.vandalism",
    icon: <MaterialCommunityIcons name="spray" size={40} color="#fff" />,
    color: "#673ab7",
  },
  {
    id: "18",
    nameKey: "dashboard.treeCutting",
    icon: (
      <MaterialCommunityIcons name="tree-outline" size={40} color="#fff" />
    ),
    color: "#2e7d32",
  },
  {
    id: "19",
    nameKey: "dashboard.potholes",
    icon: (
      <MaterialCommunityIcons name="road-variant" size={40} color="#fff" />
    ),
    color: "#5d4037",
  },
];

function DashboardContent() {
  const router = useRouter();

  const photos = [
    require("../assets/images/image1.png"),
    require("../assets/images/image2.png"),
    require("../assets/images/image3.png"),
    require("../assets/images/image4.png"),
  ];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex(
        (prevIndex) => (prevIndex + 1) % photos.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      })
    ).start();
  }, [borderAnimation]);

  return (
    <LinearGradient
      colors={["#ccffcc", "#ffcccc"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <Text style={styles.title}>{i18n.t("dashboard.title")}</Text>
        <Text style={styles.subtitle}>{i18n.t("dashboard.subtitle")}</Text>

        {/* Rotating Photos */}
        <View style={styles.photoContainer}>
          <Image
            source={photos[currentPhotoIndex]}
            style={styles.photo}
          />
        </View>

        {/* Info Card + Report Button */}
        <View style={styles.card}>
          <Text style={styles.me}>
            {i18n.t("dashboard.reportDescription")}
          </Text>
          <Text style={styles.me}>
            {i18n.t("dashboard.reportDescription2")}
          </Text>

          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={["#000", "#ff99cc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.backButton}
            >
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => router.push("/report")}
                onPressIn={() => setButtonPressed(true)}
                onPressOut={() => setButtonPressed(false)}
              >
                <Text
                  style={[
                    styles.backButtonText,
                    buttonPressed && { color: "#E0E0E0" },
                  ]}
                >
                  {i18n.t("dashboard.reportIssue")}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Department Overview Grid */}
        <Text style={styles.heading}>{i18n.t("dashboard.departmentOverview")}</Text>
        <View style={styles.grid}>
          {departments.map((dept) => (
            <View
              key={dept.id}
              style={[styles.deptCard, { backgroundColor: dept.color }]}
            >
              {dept.icon}
              <Text style={styles.deptName}>{i18n.t(dept.nameKey)}</Text>
            </View>
          ))}
        </View>

        {/* Video Section */}
        <Text style={styles.heading}>{i18n.t("dashboard.exploreApp")}</Text>
        <View style={styles.videoContainer}>
          <Video
            source={require("../assets/nagarsahaytavideo.mp4")}
            style={styles.video}
            useNativeControls={isVideoPlaying}
            shouldPlay={isVideoPlaying}
            isLooping={true}
          />
          {!isVideoPlaying && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsVideoPlaying(true)}
            >
              <Ionicons name="play-circle" size={60} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export const unstable_settings = {
  headerShown: false,
};

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  photoContainer: {
    height: 220,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  me: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  backButton: {
    padding: 15,
    width: 200,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonTouchable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    height:600,
    
  },
  deptCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  deptName: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
  videoContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 30,
    padding: 10,
  },
});
