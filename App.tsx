import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './src/theme/config';
import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Get screen dimensions
const { width, height } = Dimensions.get('window');

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    async function prepare() {
      try {
        // Start fade-in animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ]).start();

        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating loading time
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fadeAnim, scaleAnim]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Animate out before hiding splash screen
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(async () => {
        // This tells the splash screen to hide immediately
        await SplashScreen.hideAsync();
      });
    }
  }, [appIsReady, fadeAnim, scaleAnim]);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image 
            source={require('./assets/splash-icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <GluestackUIProvider config={config}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </GluestackUIProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#216EAF', // Primary brand color
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  }
});
