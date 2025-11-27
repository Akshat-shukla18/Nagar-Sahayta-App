import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";


export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const navigateTo = (path: string) => {
    router.push(path as any);
    setIsSidebarVisible(false);
  };

  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      signOut();
      Alert.alert("Success", "Logged out successfully!");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };



  const sidebarMenuItems = [
    { name: "Home", path: "/", icon: "home" },
    { name: "My Reports", path: "/Myreports", icon: "mail" },
    { name: "Profile", path: "/profile", icon: "document-text" },
    { name: "About", path: "/about", icon: "information-circle" },
   
  ];

  const getInitial = () => {
    return user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";
  };

  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: "#ffffff",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    navbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#f8f9fa",
      paddingHorizontal: width * 0.04,
      paddingVertical: width * 0.03,
      borderBottomWidth: 1,
      borderBottomColor: "#d6d6d6",
      elevation: 4,
    },
    menuButton: {
      padding: width * 0.02,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    navItem: {
      paddingHorizontal: width * 0.04,
      paddingVertical: width * 0.015,
      borderRadius: 15,
      backgroundColor: "#eaf4ff",
      marginRight: width * 0.02,
    },
    navText: {
      fontSize: width * 0.045,
      fontWeight: "600",
      color: "#004080",
    },
    profileAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#004080",
      alignItems: "center",
      justifyContent: "center",
    },
    profileInitial: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    },
    languageButton: {
      padding: 8,
      marginRight: width * 0.02,
    },
    sidebarOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    sidebarContainer: {
      flex: 1,
      width: "75%",
    },
    sidebar: {
      flex: 1,
      backgroundColor: "#ffffff",
      padding: width * 0.05,
    },
    sidebarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: width * 0.07,
      paddingBottom: width * 0.035,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    sidebarTitle: {
      fontSize: width * 0.05,
      fontWeight: "bold",
      color: "#004080",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: width * 0.035,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    menuIcon: {
      marginRight: width * 0.035,
      width: 24,
    },
    menuText: {
      fontSize: 0.04 * width,
      color: "#333",
    },
    logoutItem: {
      marginTop: width * 0.07,
      borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
      paddingTop: width * 0.07,
    },
    logoutText: {
      color: "#ff3b30",
      fontWeight: "600",
    },
    languageModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    languageModalContainer: {
      flex: 1,
      backgroundColor: "#e0f7fa",
    },

  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navbar}>
          {/* Sidebar Menu Button */}
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
            <Ionicons name="menu" size={26} color="#004080" />
          </TouchableOpacity>

          {/* Title in center */}
          <TouchableOpacity onPress={() => router.push("/dashboard" as any)}>
          <Text style={{ fontSize: width * 0.05, fontWeight: "bold", color: "#004080" }}>
            Civic Dashboard
          </Text>
          </TouchableOpacity>

          {/* Right side: My Reports, Language, and Profile */}

          <View style={styles.rightContainer}>
            {width > 400 && (
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/Myreports" as any)}
              >
                <Text style={styles.navText}>Reports</Text>
              </TouchableOpacity>
            )}
          <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setIsLanguageModalVisible(true)}
            >
              <Ionicons name="globe" size={24} color="#004080" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileAvatar}
              onPress={() => router.push("/profile" as any)}
            >
              <Text style={styles.profileInitial}>{getInitial()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Sidebar Modal */}
      <Modal
        visible={isSidebarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleSidebar}
      >
        <TouchableOpacity
          style={styles.sidebarOverlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        >
          <SafeAreaView style={styles.sidebarContainer}>
            <View style={styles.sidebar}>
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Menu</Text>
                <TouchableOpacity onPress={toggleSidebar}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {sidebarMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => navigateTo(item.path)}
                >
                  <Ionicons name={item.icon as any} size={20} color="#004080" style={styles.menuIcon} />
                  <Text style={styles.menuText}>{item.name}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { setIsLanguageModalVisible(true); setIsSidebarVisible(false); }}
              >
                <Ionicons name="globe" size={20} color="#004080" style={styles.menuIcon} />
                <Text style={styles.menuText}>Language</Text>
              </TouchableOpacity>

              {user && (
                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutItem]}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#ff3b30" style={styles.menuIcon} />
                  <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.languageModalOverlay}
          activeOpacity={1}
          onPress={() => setIsLanguageModalVisible(false)}
        >
          <SafeAreaView style={styles.languageModalContainer}>
            <LanguageSwitcher onConfirm={() => setIsLanguageModalVisible(false)} isModal={true} />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>

      

    </>
  );
}
