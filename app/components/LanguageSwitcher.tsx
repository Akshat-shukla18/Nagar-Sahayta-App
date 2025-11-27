import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "../contexts/LanguageContext";
import i18n from "../i18n";

const { width } = Dimensions.get("window");

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "ks", name: "کٲشُر" },
  { code: "kok", name: "खोरठा" },
  { code: "kru", name: "कुरुख" },
  { code: "mai", name: "मैथिली" },
  { code: "ml", name: "മലയാളം" },
  { code: "mni", name: "मुण्डारी" },
  { code: "mr", name: "मराठी" },
  { code: "nag", name: "नागपुरी" },
  { code: "ne", name: "नेपाली" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "sa", name: "संस्कृतम्" },
  { code: "san", name: "ᱥᱟᱱᱛᱟᱞᱤ" },
  { code: "brx", name: "बड़ो" },
  { code: "doi", name: "डोगरी" },
];

export default function LanguageSwitcher({ onConfirm, isModal }: { onConfirm?: () => void; isModal?: boolean }) {
  const router = useRouter();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (locale: string) => {
    setSelectedLanguage(locale);
  };

  const handleConfirm = () => {
    changeLanguage(selectedLanguage);
    if (onConfirm) {
      onConfirm();
    } else {
      // Instead of just navigating, trigger a full app refresh by reloading the root layout
      router.replace("/");
    }
  };

  return (
    <View style={[styles.container, isModal && styles.modalContainer]}>
      <Text style={[styles.title, isModal && styles.modalTitle]}>
        {i18n.t("languageSwitcher.selectLanguage", {
          defaultValue: "🌐 Select Your Language",
        })}
      </Text>

      <ScrollView
        contentContainerStyle={styles.languagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              selectedLanguage === lang.code && styles.selectedLanguageButton,
            ]}
            onPress={() => handleLanguageChange(lang.code)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.languageButtonText,
                selectedLanguage === lang.code &&
                  styles.selectedLanguageButtonText,
              ]}
            >
              {i18n.t(`language.${lang.code}`, { defaultValue: lang.name })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>
          {i18n.t("languageSwitcher.confirm", { defaultValue: "✅ Confirm" })}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    height:600,
    paddingHorizontal: 20,
    backgroundColor: "#e0f7fa", // light aqua background
    alignItems: "center",
  },
  modalContainer: {
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#004d40",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  languagesContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  languageButton: {
    width: width * 0.85,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#004d40",
    paddingVertical: 18,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  selectedLanguageButton: {
    backgroundColor: "#00796b",
    borderColor: "#004d40",
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  languageButtonText: {
    fontSize: 20,
    color: "#004d40",
    fontWeight: "500",
  },
  selectedLanguageButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  confirmButton: {
    width: width * 0.8,
    backgroundColor: "#00796b",
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#004d40",
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});
