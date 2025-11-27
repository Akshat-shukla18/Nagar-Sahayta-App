import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { WebView } from 'react-native-webview';
import i18n from './i18n';

const Report = () => {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [locationn, setlocationn] = useState("");
  const [problemType, setProblemType] = useState("Public Works");

  const [location, setLocation] = useState({
    latitude: 23.3441,
    longitude: 85.3096,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapUri, setMapUri] = useState(`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.5},${location.latitude - 0.5},${location.longitude + 0.005},${location.latitude + 0.005}&layer=mapnik&marker=${location.latitude},${location.longitude}`);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Request permission and pick image from device
  const pickImage = async () => {
    Alert.alert(
      i18n.t("report.selectImageSource"),
      i18n.t("report.chooseHowToAddPhoto"),
      [
        { text: i18n.t("report.cancel"), style: "cancel" },
        { text: i18n.t("report.takePhoto"), onPress: pickImageFromCamera },
        { text: i18n.t("report.chooseFromGallery"), onPress: pickImageFromGallery },
      ]
    );
  };

  const pickImageFromGallery = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(i18n.t("report.permissionRequired"), i18n.t("report.permissionMediaLibrary"));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      // Type assertion to ImagePicker.ImagePickerSuccessResult
      const successResult = result as ImagePicker.ImagePickerSuccessResult;
      setImage(successResult.assets[0].uri);
      setImageBase64(successResult.assets[0].base64 || null);
    }
  };

  const pickImageFromCamera = async () => {
    // Ask for camera permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(i18n.t("report.permissionRequired"), i18n.t("report.permissionCamera"));
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      // Type assertion to ImagePicker.ImagePickerSuccessResult
      const successResult = result as ImagePicker.ImagePickerSuccessResult;
      setImage(successResult.assets[0].uri);
      setImageBase64(successResult.assets[0].base64 || null);
    }
  };

  // Mark current location
  const markCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(i18n.t("report.permissionDenied"), i18n.t("report.permissionLocationDenied"));
        return;
      }
      let locationResult = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationResult.coords;
      setLocation({ latitude, longitude });
      setMapUri(`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005},${latitude - 0.005},${longitude + 0.005},${latitude + 0.005}&layer=mapnik&marker=${latitude},${longitude}`);
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert(i18n.t("report.error"), i18n.t("report.errorFetchingLocation"));
    } finally {
      setIsLoadingLocation(false);
    }
  };





  // Handle submit button press
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userId = "anonymous"; // Replace with actual user ID from AuthContext if available

      const formData = new FormData();
      formData.append('description', description);
      formData.append('problemType', problemType);
      formData.append('location', JSON.stringify(location));
      formData.append('locationn', locationn);
      formData.append('userId', userId);

      if (image) {
        // @ts-ignore
        formData.append('image', {
          uri: image,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch('http://172.20.10.8:5000/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert(i18n.t("report.reportSubmitted"), i18n.t("report.reportSubmittedSuccessfully"));
        // Optionally clear form or navigate
      } else {
        Alert.alert(i18n.t("report.submissionFailed"), i18n.t("report.submissionFailedMessage"));
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert(i18n.t("report.error"), i18n.t("report.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <KeyboardAvoidingView style={styles.gradientContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.reportTitle}>{i18n.t("report.reportNewIssue")}</Text>

        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
          <View style={styles.overlayContainer}>
            <View style={styles.iconAndTextContainer}>
              <View style={styles.cameraIconContainer}>
                <MaterialIcons name="photo-camera" size={48} color="white" />
                <View style={styles.plusIconContainer}>
                  <Text style={styles.plusIcon}>+</Text>
                </View>
              </View>
              <Text style={styles.tapToPhotoText}>{i18n.t("report.tapToPhotoReport")}</Text>
            </View>
          </View>
        </TouchableOpacity>

 <Text style={styles.label}>{i18n.t("report.describeIssue")}</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder={i18n.t("report.stateTheIssue")}
          placeholderTextColor="#827775"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>{i18n.t("report.problemType")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={problemType}
            onValueChange={(itemValue: string) => {
              console.log("Picker value changed to:", itemValue);
              setProblemType(itemValue);
            }}
          >
            <Picker.Item label={i18n.t("report.problemTypes.publicWorks")} value="Public Works" />
            <Picker.Item label={i18n.t("report.problemTypes.sanitation")} value="Sanitation" />
            <Picker.Item label={i18n.t("report.problemTypes.streetLighting")} value="Street Lighting" />
            <Picker.Item label={i18n.t("report.problemTypes.parksAndRecreation")} value="Parks and Recreation" />
            <Picker.Item label={i18n.t("report.problemTypes.waterAndDrainage")} value="Water and Drainage" />
            <Picker.Item label={i18n.t("report.problemTypes.trafficAndTransportation")} value="Traffic and Transportation" />
            <Picker.Item label={i18n.t("report.problemTypes.urbanPlanning")} value="Urban Planning" />
            <Picker.Item label={i18n.t("report.problemTypes.animalControl")} value="Animal Control" />
            <Picker.Item label={i18n.t("report.problemTypes.environmentalServices")} value="Environmental Services" />
             <Picker.Item label={i18n.t("report.problemTypes.Other")} value="Other" />
          </Picker>
        </View>

         <Text style={styles.label}>{i18n.t("report.landmarkArea")}</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder={i18n.t("report.nearbyLandmarkArea")}
          placeholderTextColor="#827775"
          multiline
          value={locationn}
          onChangeText={setlocationn}
        />
                 <Text style={styles.label}>{i18n.t("report.chooseFromMap")}</Text>

{/* Live coordinates display */}
{/* <Text style={styles.coordText}>
  Latitude: {location.latitude.toFixed(5)} | Longitude: {location.longitude.toFixed(5)}
</Text> */}

{/* Map */}
<View style={styles.mapContainer}>
  <WebView
    style={styles.map}
    source={{ uri: mapUri }}
  />
</View>

<View style={styles.buttonRow}>
  <TouchableOpacity style={styles.locationButton} onPress={markCurrentLocation} disabled={isLoadingLocation}>
    {isLoadingLocation ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="white" />
        <Text style={styles.locationButtonText}>{i18n.t("report.markCurrentLocation")}</Text>
      </View>
    ) : (
      <Text style={styles.locationButtonText}>{i18n.t("report.markCurrentLocation")}</Text>
    )}
  </TouchableOpacity>

  <TouchableOpacity style={styles.confirmButton} onPress={() => Alert.alert(i18n.t("report.locationConfirmed"), ` ${locationn}`)}>
    <Text style={styles.confirmButtonText}>{i18n.t("report.confirmLocation")}</Text>
  </TouchableOpacity>
</View>

        {/* <Text style={styles.label}>Location</Text>
        <View style={styles.map}>
          <Text style={styles.mapText}>Map placeholder - Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</Text>
        </View> */}

        {isSubmitting ? (
          <View style={[styles.submitButton, styles.sendingReportContainer]}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.sendingReportText}>{i18n.t("report.sendingReport")}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>{i18n.t("report.submitReport")}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{i18n.t("report.backToDashboard")}</Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#11182", // neutral dark text
    marginBottom: 15,
    textAlign: "center",
    marginTop: 20,
  },
  imageUpload: {
    height: 200,
    borderWidth: 1,
    borderColor: "#fff", // neutral border
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#BDD2D9", // neutral background
  },
  uploadText: {
    color: "#6B7280", // neutral text
    fontSize: 16,
   // backgroundBlendMode: ,
    borderRadius:20,

  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: 'cover',
  },
  descriptionInput: {
    height: 60,
    backgroundColor: "#FFFFFF", // white background
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    textAlignVertical: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB", // neutral border
    color: "#000", // neutral text
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    height: 20,
    color: "#000", // neutral muted text
  },
  pickerContainer: {
    backgroundColor: "#111827", // dark neutral background
    borderRadius: 8,
    marginBottom: 15,
  },
  
  mapContainer: {
    height: 500,
    borderRadius: 8,
    marginBottom: 20,

  },
  map: {
    flex: 1,
  },
  mapText: {
    color: "#111827", // neutral text
    fontSize: 18,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#000", // neutral gray button (replacing blue)
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    marginTop:15,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#000", // neutral gray button
    padding: 12,
    borderRadius: 8,
    opacity:0.5,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  locationButton: {
    backgroundColor: "#10B981", // green button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 0,
    flex: 1,
    marginRight: 10,
  },
  locationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign:"center",
  },
  confirmButton: {
    backgroundColor: "#F59E0B", // amber button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 0,
    flex: 1,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign:"center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reportTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  cameraButton: {
    alignSelf: "stretch",
    backgroundColor: "#60D0E0",
    width: "100%",
    height: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(96, 208, 224, 0.5)", // semi-transparent overlay
    borderRadius: 12,
  },
  iconAndTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconContainer: {
    position: "relative",
  },
  plusIconContainer: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "white",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    color: "#3B82F6",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
  tapToPhotoText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "white",
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sendingReportContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor:"red",
  },
  sendingReportText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default Report;
