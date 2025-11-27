import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import ProtectedRoute from "./components/ProtectedRoute";

function TranslateScreen() {
  const jsCode = `
    // Hide header and footer
    document.querySelector('#gb')?.remove();       // Google top bar
    document.querySelector('#ft')?.remove();       // Footer
    document.querySelector('#gbqfbb')?.remove();   // "I'm Feeling Lucky"
    document.querySelector('#gbqf')?.style.display = "none"; // Search bar
    
    // Make translation box full screen
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  `;

  return (
    <WebView
      source={{ uri: "https://translate.google.com/?sl=en&tl=hi&op=translate" }}
      injectedJavaScript={jsCode}
      javaScriptEnabled={true}
      style={styles.container}
    />
  );
}

export default function Translate() {
  return (
    <ProtectedRoute>
      <TranslateScreen />
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
