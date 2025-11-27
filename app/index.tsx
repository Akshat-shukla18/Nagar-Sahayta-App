import React, { useRef, useEffect, useState } from "react";
import { Text, View, StyleSheet, Animated, Easing, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./contexts/AuthContext";

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();
  const scaleAnim = useRef(new Animated.Value(0)).current; // start from invisible
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const startAnimation = () => {
    scaleAnim.setValue(0); // Reset animation
    Animated.timing(scaleAnim, {
      toValue: 1,          // final size
      duration: 2500,      // slow animation
      easing: Easing.out(Easing.exp), // smooth "pop"
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Reset the animation when refreshing
    startAnimation();
    
    // Simulate a network request or data loading
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleStart = () => {
    setLoading(true);
    // Add a small delay for smoother transition
    setTimeout(() => {
      router.push("/login");
      setLoading(false);
    }, 300);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#000000"]}
          tintColor="#000000"
        />
      }
    >
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.text,
            {
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1], // starts tiny, grows to normal
                  }),
                },
              ],
            },
          ]}
        >
          Welcome.
        </Animated.Text>
        <Text style={styles.hintText}>Pull down to refresh</Text>
        <TouchableOpacity
          style={[styles.startButton, loading && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.startButtonText}>Let's Start</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 42,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  hintText: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    fontStyle: "italic",
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
});
