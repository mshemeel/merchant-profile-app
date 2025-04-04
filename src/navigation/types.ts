import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Define the parameters for each route
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  MIDList: undefined;
  MIDDetails: { midId: string };
  TIDList: { midId: string };
  TIDDetails: { midId: string; tidId: string };
  TransactionList: { midId?: string; tidId?: string };
  TransactionDetails: { transactionId: string };
};

// Define tab navigator param list
export type MainTabParamList = {
  Dashboard: undefined;
  MIDs: undefined;
  Transactions: undefined;
  Profile: undefined;
};

// Define navigation prop types
export type NavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  T
>;

// Define tab navigation prop types
export type TabNavigationProp<T extends keyof MainTabParamList> = BottomTabNavigationProp<
  MainTabParamList,
  T
>;

// Define route prop types
export type RoutePropType<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>; 