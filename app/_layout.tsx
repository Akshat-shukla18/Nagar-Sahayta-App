import { Stack } from "expo-router";
import './global.css';
import Navbar from './components/Navbar';
import { View, SafeAreaView, Text } from "react-native";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';


function LayoutContent() {
  const { user, loading } = useAuth();
  const { currentLanguage } = useLanguage();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {user && <Navbar />}
      <SafeAreaView style={{ flex: 1 }}>
        <Stack key={currentLanguage} screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </View>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <LayoutContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
