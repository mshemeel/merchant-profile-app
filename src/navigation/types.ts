import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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

// Define navigation prop types
export type NavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  T
>;

// Define route prop types
export type RoutePropType<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>; 