import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
} from "react-native";
import i18n from './i18n';

export default function AboutUs() {
  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo + Title fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Slogans pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Button press bounce
  const handlePress = () => {
    Animated.sequence([
      Animated.spring(buttonAnim, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(buttonAnim, { toValue: 1, useNativeDriver: true }),
    ]).start(() => Linking.openURL("mailto:support.jharkhand@gov.in"));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo and Title */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Image
          source={require("../assets/images/image5.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>{i18n.t('about.title')}</Text>
        <Text style={styles.subtitle}>{i18n.t('about.subtitle')}</Text>
      </Animated.View>

      {/* About Section */}
      <View style={[styles.section, { backgroundColor: "#eaf2f8" }]}>
        <Text style={styles.heading}>{i18n.t('about.aboutUs')}</Text>
        <Text style={styles.text}>
          {i18n.t('about.aboutText')}
        </Text>
      </View>

      {/* Features Section */}
      <View style={[styles.section, { backgroundColor: "#fef5e7" }]}>
        <Text style={styles.heading}>{i18n.t('about.features')}</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {i18n.t('about.feature1')}
          </Text>
          <Text style={styles.cardText}>
            {i18n.t('about.feature2')}
          </Text>
          <Text style={styles.cardText}>
            {i18n.t('about.feature3')}
          </Text>
          <Text style={styles.cardText}>
            {i18n.t('about.feature4')}
          </Text>
        </View>
      </View>

      {/* Reliability */}
      <View style={[styles.section, { backgroundColor: "#e8f8f5" }]}>
        <Text style={styles.heading}>{i18n.t('about.reliability')}</Text>
        <Text style={styles.text}>
          {i18n.t('about.reliabilityText')}
        </Text>
      </View>

      {/* Motivational Slogans */}
      <View style={[styles.section, { backgroundColor: "#fff" }]}>
        <Text style={styles.heading}>{i18n.t('about.slogans')}</Text>
        <Animated.Text style={[styles.slogan, { transform: [{ scale: pulseAnim }] }]}>
          {i18n.t('about.slogan1')}
        </Animated.Text>
        <Animated.Text style={[styles.slogan, { transform: [{ scale: pulseAnim }] }]}>
          {i18n.t('about.slogan2')}
        </Animated.Text>
        <Animated.Text style={[styles.slogan, { transform: [{ scale: pulseAnim }] }]}>
          {i18n.t('about.slogan3')}
        </Animated.Text>
      </View>

      {/* Helpline Section */}
      <View style={[styles.section, { backgroundColor: "#f4ecf7" }]}>
        <Text style={styles.heading}>{i18n.t('about.connect')}</Text>
        <Text style={styles.text}>{i18n.t('about.helpline')}</Text>
        <Text style={styles.text}>{i18n.t('about.police')}</Text>
        <Text style={styles.text}>{i18n.t('about.fire')}</Text>
        <Text style={styles.text}>{i18n.t('about.ambulance')}</Text>
        <Text style={styles.text}>{i18n.t('about.women')}</Text>
        <Text style={styles.text}>{i18n.t('about.child')}</Text>
        <Text style={styles.text}>{i18n.t('about.email')}</Text>

        <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>{i18n.t('about.writeToUs')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { alignItems: "center", marginTop: 30 },
  logo: { width: 100, height: 100, resizeMode: "contain", borderRadius: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 10, color: "#2c3e50" },
  subtitle: { fontSize: 16, color: "#555" },
  section: {
    margin: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  slogan: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
    color: "#e74c3c",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
