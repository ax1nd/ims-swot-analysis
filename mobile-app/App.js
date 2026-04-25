import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform, View, Text, ActivityIndicator, useColorScheme, NativeModules } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function App() {
  /**
   * Host where Vite (5173) and ml-api (5001) run — must be reachable from the device.
   * Physical phones cannot use 10.0.2.2 (emulator-only) or 127.0.0.1 (device loopback).
   */
  const normalizeDevMachineHost = (value) => {
    if (!value || typeof value !== 'string') return null;
    let s = value.trim();
    if (!s) return null;
    if (s.includes('://')) {
      try {
        s = new URL(s).hostname;
      } catch {
        return null;
      }
    } else {
      const idx = s.lastIndexOf(':');
      if (idx > 0) {
        const tail = s.slice(idx + 1);
        if (/^\d+$/.test(tail)) s = s.slice(0, idx);
      }
    }
    if (s === 'localhost' || s === '127.0.0.1') return null;
    // Tunnel URL is not your LAN machine for arbitrary ports (Vite). Use EXPO_PUBLIC_DEV_HOST.
    if (s.endsWith('.exp.direct')) return null;
    return s;
  };

  const getHostFromExpoConstants = () => {
    const candidates = [
      Constants.expoGoConfig?.debuggerHost,
      Constants.expoConfig?.hostUri,
      Constants.manifest?.debuggerHost,
      Constants.manifest2?.extra?.expoGo?.debuggerHost,
    ];
    for (const c of candidates) {
      const host = normalizeDevMachineHost(String(c || ''));
      if (host) return host;
    }
    return null;
  };

  const getDevHost = () => {
    const configuredHost = process.env.EXPO_PUBLIC_DEV_HOST;
    if (configuredHost && configuredHost.trim()) return configuredHost.trim();

    const fromExpo = getHostFromExpoConstants();
    if (fromExpo) return fromExpo;

    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      try {
        const parsed = new URL(scriptURL);
        const h = normalizeDevMachineHost(parsed.hostname);
        if (h) return h;
      } catch (_error) {
        // Fall through.
      }
    }

    return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
  };

  const devHost = getDevHost();
  const hostHint =
    devHost === '10.0.2.2' || devHost === '127.0.0.1'
      ? 'On a real phone, set EXPO_PUBLIC_DEV_HOST to your PC Wi‑Fi IPv4 (ipconfig), or run Expo with LAN (not tunnel).'
      : '';
  const url = `http://${devHost}:5173`;
  const apiBase = `http://${devHost}:5001`;
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';
  const [expoOptimization, setExpoOptimization] = useState(null);
  const [loadingOptimization, setLoadingOptimization] = useState(true);
  const [webviewError, setWebviewError] = useState('');

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
        {!!hostHint && (
          <Text style={[styles.hostHint, isDark ? styles.hostHintDark : styles.hostHintLight]}>{hostHint}</Text>
        )}
        <Text style={[styles.devTarget, isDark ? styles.devTargetDark : styles.devTargetLight]} numberOfLines={2}>
          Web + API: {url} · {apiBase}
        </Text>
      </View>
      <WebView 
        source={{ uri: url }} 
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        allowsInlineMediaPlayback={true}
        bounces={false}
        userAgent="Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"
        originWhitelist={['*']}
        onError={(event) => {
          const desc = event?.nativeEvent?.description || 'Unable to load local web app.';
          setWebviewError(desc);
        }}
        onHttpError={(event) => {
          const statusCode = event?.nativeEvent?.statusCode;
          if (statusCode) setWebviewError(`Web app returned HTTP ${statusCode}.`);
        }}
      />
      {!!webviewError && (
        <View style={[styles.webviewErrorCard, isDark ? styles.webviewErrorCardDark : styles.webviewErrorCardLight]}>
          <Text style={[styles.webviewErrorTitle, isDark ? styles.webviewErrorTitleDark : styles.webviewErrorTitleLight]}>
            Web loading error
          </Text>
          <Text style={[styles.webviewErrorText, isDark ? styles.webviewErrorTextDark : styles.webviewErrorTextLight]}>
            {webviewError}
          </Text>
          <Text style={[styles.webviewErrorText, isDark ? styles.webviewErrorTextDark : styles.webviewErrorTextLight]}>
            Check that Vite is running at {url}
          </Text>
        </View>
      )}
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
  hostHint: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 6,
  },
  hostHintDark: {
    color: '#fbbf24',
  },
  hostHintLight: {
    color: '#b45309',
  },
  devTarget: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
    opacity: 0.85,
  },
  devTargetDark: {
    color: '#94a3b8',
  },
  devTargetLight: {
    color: '#64748b',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webview: {
    flex: 1, 
    backgroundColor: '#0f172a' 
  },
  webviewErrorCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  webviewErrorCardDark: {
    backgroundColor: '#3f1d1d',
    borderColor: '#7f1d1d',
  },
  webviewErrorCardLight: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  webviewErrorTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  webviewErrorTitleDark: {
    color: '#fecaca',
  },
  webviewErrorTitleLight: {
    color: '#991b1b',
  },
  webviewErrorText: {
    fontSize: 11,
    lineHeight: 16,
  },
  webviewErrorTextDark: {
    color: '#fecaca',
  },
  webviewErrorTextLight: {
    color: '#7f1d1d',
  }
});
