import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform, View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  // Directly load the running Vite dev server IP
  const url = 'http://10.10.29.86:5173';
  const apiBase = 'http://10.10.29.86:5001';
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';
  const [expoOptimization, setExpoOptimization] = useState(null);
  const [loadingOptimization, setLoadingOptimization] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadOptimizationPlan = async () => {
      try {
        const res = await fetch(`${apiBase}/api/mobile/expo-optimization-v1`);
        const data = await res.json().catch(() => null);
        if (!cancelled && res.ok && data?.expo_optimization_v1) {
          setExpoOptimization(data.expo_optimization_v1);
        }
      } catch (_error) {
        // Keep app usable even if API is unreachable.
      } finally {
        if (!cancelled) setLoadingOptimization(false);
      }
    };
    loadOptimizationPlan();
    return () => { cancelled = true; };
  }, []);

  return (
    <SafeAreaView style={[styles.safe, isDark ? styles.safeDark : styles.safeLight]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0f172a' : '#f8fafc'} />
      <View style={[styles.optimizationCard, isDark ? styles.optimizationCardDark : styles.optimizationCardLight]}>
        <Text style={[styles.optimizationTitle, isDark ? styles.optimizationTitleDark : styles.optimizationTitleLight]}>Expo Optimization v1</Text>
        {loadingOptimization ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#38bdf8" />
            <Text style={[styles.optimizationMeta, isDark ? styles.optimizationMetaDark : styles.optimizationMetaLight]}>Syncing from backend...</Text>
          </View>
        ) : (
          <Text style={[styles.optimizationMeta, isDark ? styles.optimizationMetaDark : styles.optimizationMetaLight]}>
            {expoOptimization
              ? `Engine: ${expoOptimization.runtime_performance?.js_engine || 'Hermes'} | Goal: ${expoOptimization.bundle_analysis?.goal || 'Main bundle below 2MB'}`
              : 'Using local web experience. Backend optimization profile unavailable.'}
          </Text>
        )}
      </View>
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
    // Extra top padding for Android notches if needed
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  safeDark: {
    backgroundColor: '#0f172a',
  },
  safeLight: {
    backgroundColor: '#f8fafc',
  },
  optimizationCard: {
    marginHorizontal: 12,
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  optimizationCardDark: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
  },
  optimizationCardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  optimizationTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  optimizationTitleDark: {
    color: '#e2e8f0',
  },
  optimizationTitleLight: {
    color: '#0f172a',
  },
  optimizationMeta: {
    fontSize: 12,
    lineHeight: 16,
  },
  optimizationMetaDark: {
    color: '#93c5fd',
  },
  optimizationMetaLight: {
    color: '#2563eb',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webview: {
    flex: 1, 
    backgroundColor: '#0f172a' 
  }
});
