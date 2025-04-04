import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from './types';

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

// Temporary TabBarIcon component (will be replaced with proper icons)
const TabBarIcon = ({ name, color }: { name: string; color: string }) => {
  return (
    <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />
  );
};

// Main tab navigator (after login)
const MainTabNavigator = () => {
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
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: false,
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
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="credit-card" color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionListScreen} 
        options={{
          title: 'Transactions',
          headerShown: false,
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
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main app navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
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
  );
};

export default AppNavigator; 