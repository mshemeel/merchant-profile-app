import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from './types';
import { Ionicons } from '@expo/vector-icons';
import { Box, Spinner, Center, Heading } from '@gluestack-ui/themed';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MIDListScreen from '../screens/MIDListScreen';
import MIDDetailsScreen from '../screens/MIDDetailsScreen';
import TIDListScreen from '../screens/TIDListScreen';
import TIDDetailsScreen from '../screens/TIDDetailsScreen';
import TransactionListScreen from '../screens/TransactionListScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// TabBarIcon component with proper icons
const TabBarIcon = ({ name, color }: { name: string; color: string }) => {
  return (
    <Ionicons name={name as any} size={24} color={color} />
  );
};

// Main tab navigator (after login)
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#216EAF',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? 0 : 5,
          paddingTop: 5,
          height: 60 + (Platform.OS === 'ios' ? insets.bottom : 0),
          paddingHorizontal: 5,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="MIDs" 
        component={MIDListScreen} 
        options={{
          title: 'MIDs',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="card" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionListScreen} 
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Loading screen component
const LoadingScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <Center flex={1} bg="#FFFFFF">
      <Spinner size="large" color="#216EAF" />
      <Heading mt="$4" color="#216EAF" size="md">Loading...</Heading>
    </Center>
  </SafeAreaView>
);

// Main app navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#216EAF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyle: { backgroundColor: '#fff' },
          }}
        >
          {!isAuthenticated ? (
            // Auth screens
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
          ) : (
            // App screens
            <>
              <Stack.Screen 
                name="Main" 
                component={MainTabNavigator} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="MIDDetails" 
                component={MIDDetailsScreen} 
                options={{ title: 'MID Details' }}
              />
              <Stack.Screen 
                name="TIDList" 
                component={TIDListScreen} 
                options={{ title: 'Terminal IDs' }}
              />
              <Stack.Screen 
                name="TIDDetails" 
                component={TIDDetailsScreen} 
                options={{ title: 'TID Details' }}
              />
              <Stack.Screen 
                name="TransactionList" 
                component={TransactionListScreen} 
                options={{ title: 'Transactions' }}
              />
              <Stack.Screen 
                name="TransactionDetails" 
                component={TransactionDetailsScreen} 
                options={{ title: 'Transaction Details' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AppNavigator; 