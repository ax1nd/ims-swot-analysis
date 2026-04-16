import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  // Directly load the running Vite dev server IP
  const url = 'http://10.10.29.86:5173';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <WebView 
        source={{ uri: url }} 
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        allowsInlineMediaPlayback={true}
        bounces={false}
        userAgent="Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#0f172a',
    // Extra top padding for Android notches if needed
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  webview: { 
    flex: 1, 
    backgroundColor: '#0f172a' 
  }
});
