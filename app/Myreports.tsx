import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import i18n from "./i18n";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Report {
  _id: string;
  description: string;
  problemType: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationn: string;
  imageUri: string;
  userId: string;
  timestamp: string;
}

export default function Myreports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const userId = "anonymous"; // Replace with actual user ID from AuthContext if available
      const response = await fetch(`http://172.20.10.8:5000/api/reports?userId=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        Alert.alert(i18n.t('myReports.title'), i18n.t('myReports.title'));
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert(i18n.t('myReports.title'), i18n.t('myReports.title'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => router.push('/solved-problems')} style={styles.iconButton}>
          <Ionicons name="checkmark-done-circle-outline" size={28} color="#007bff" />
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{i18n.t('myReports.title')}</Text>
        </View>
      </View>
        <Text style={styles.loadingText}>{i18n.t('myReports.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => router.push('/solved-problems')} style={styles.iconButton}>
          <Ionicons name="checkmark-done-circle-outline" size={28} color="#007bff" />
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{i18n.t('myReports.title')}</Text>
        </View>
      </View>
      <ScrollView>
      {reports.length === 0 ? (
        <Text style={styles.noReportsText}>{i18n.t('myReports.noReports')}</Text>
      ) : (
        reports.map((report) => (
          <View key={report._id} style={styles.reportCard}>
            <Text style={styles.problemType}>{report.problemType}</Text>
             {report.imageUri && (
              <Image source={{ uri: report.imageUri }} style={styles.image} />
            )}
           <Text style={styles.description}>
  👤 <Text style={{ fontWeight: "bold" }}>{i18n.t('myReports.description')}</Text> {report.description}
</Text>
{report.locationn && (
              <Text style={styles.locationn}> <Text style={{ fontWeight: "bold" }}>🌍{i18n.t('myReports.landmark')}</Text>{report.locationn}</Text>
            )}
            <Text style={styles.location}> <Text style={{ fontWeight: "bold" }}>
             📌 {i18n.t('myReports.location')}</Text> {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
            </Text>


            <Text style={styles.timestamp}>{i18n.t('myReports.submittedOn')} {formatDate(report.timestamp)}</Text>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchReports}>
        <Text style={styles.refreshButtonText}>{i18n.t('myReports.refresh')}</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconButton: {
    marginLeft: 10,
    left:330,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  noReportsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  reportCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  problemType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  location: {
    fontSize: 14,
    marginBottom: 5,
    color: "#777",
  },
  locationn: {
    fontSize: 14,
    marginBottom: 10,
    color: "#777",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  refreshButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
