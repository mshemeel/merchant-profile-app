import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Divider,
  Button,
  ButtonText,
  Center,
  Spinner,
  Badge,
  BadgeText,
  CheckCircleIcon,
  AlertCircleIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp, RoutePropType } from '../navigation/types';
import { dummyData } from '../utils/dummyData';
import { useRoute } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<'TransactionDetails'>;
};

// Define the transaction type to prevent type errors
type Transaction = {
  id: string;
  mid: string;
  tid: string;
  amount: string;
  currency: string;
  status: string;
  timestamp: string;
  date?: Date;
  type?: string;
  paymentMethod: string;
  cardType: string;
  cardLast4: string;
  authCode?: string;
  failureReason?: string;
  additionalInfo?: Record<string, string | undefined>;
};

const TransactionDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<RoutePropType<'TransactionDetails'>>();
  const { transactionId } = route.params || {};
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  
  // Helper function to generate a demo transaction if needed
  const generateTransactionFromId = (id: string): Transaction | undefined => {
    // Extract the index if it's a dynamically generated ID (e.g., txn-5)
    const match = id.match(/txn-(\d+)/);
    if (!match) return undefined;
    
    const index = parseInt(match[1], 10);
    const statuses = ['Success', 'Failed', 'Pending'];
    const types = ['Purchase', 'Refund', 'Auth', 'Void'];
    const cardTypes = ['Visa', 'MasterCard', 'Amex', 'Discover'];
    
    // Find a valid MID/TID combination
    const mid = user?.mids[0]?.mid || 'MID001';
    const tid = user?.mids[0]?.tids[0]?.tid || 'TID1001';
    
    // Generate consistent amount based on ID
    const amount = ((index + 1) * 50.25).toFixed(2);
    
    // Generate a timestamp in the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - (index % 30));
    
    return {
      id,
      mid,
      tid,
      status: statuses[index % statuses.length],
      type: types[index % types.length],
      amount,
      currency: 'AED',
      timestamp: date.toISOString(),
      paymentMethod: index % 3 === 0 ? 'Credit Card' : index % 3 === 1 ? 'Debit Card' : 'Digital Wallet',
      cardType: cardTypes[index % cardTypes.length],
      cardLast4: `${4000 + index % 1000}`,
      authCode: `AUTH${1000 + index}`,
      additionalInfo: {
        'Terminal Location': 'Main Store',
        'Customer Reference': `CUS${10000 + index}`,
        'Payment Type': index % 2 === 0 ? 'Contactless' : 'Chip & PIN'
      }
    };
  };
  
  useEffect(() => {
    if (user && transactionId) {
      // First, check in predefined dummy data
      let foundTransaction = dummyData.transactions.find(
        (t) => t.id === transactionId
      ) as Transaction | undefined;
      
      // If not found in dummy data and it looks like a dynamically generated ID,
      // create a demo transaction
      if (!foundTransaction && transactionId.startsWith('txn-')) {
        foundTransaction = generateTransactionFromId(transactionId);
      }
      
      setTransaction(foundTransaction || null);
      setLoading(false);
    }
  }, [user, transactionId]);
  
  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="large" color="$primary500" />
      </Center>
    );
  }
  
  if (!transaction) {
    return (
      <Center flex={1}>
        <Text color="$textLight600">Transaction not found</Text>
      </Center>
    );
  }
  
  // Format currency with 2 decimal places
  const formatCurrency = (amount: string) => {
    return `${amount}`;
  };
  
  // Format date with time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  return (
    <Box flex={1} bg="$backgroundLight50">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <Box bg="$white" p="$4" mb="$4" borderRadius="$lg">
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="lg" color="$textDark900">
                Transaction Details
              </Heading>
              <Badge
                action={transaction.status === 'Success' || transaction.status === 'success' ? 'success' : 'error'}
                variant="solid"
                size="md"
              >
                <BadgeText>{transaction.status}</BadgeText>
              </Badge>
            </HStack>
            
            <Divider my="$2" />
            
            <VStack space="xs">
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Transaction ID</Text>
                <Text color="$textDark900" fontWeight="$medium">{transaction.id}</Text>
              </HStack>
              
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Amount</Text>
                <Text color="$textDark900" fontWeight="$medium">
                  {formatCurrency(transaction.amount)} {transaction.currency}
                </Text>
              </HStack>
              
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Date & Time</Text>
                <Text color="$textDark900" fontWeight="$medium">
                  {formatDateTime(transaction.timestamp)}
                </Text>
              </HStack>
              
              {transaction.type && (
                <HStack justifyContent="space-between">
                  <Text color="$textLight600" fontSize="$sm">Type</Text>
                  <Text color="$textDark900" fontWeight="$medium">
                    {transaction.type}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </Box>
        
        {/* Merchant Details */}
        <Box bg="$white" p="$4" mb="$4" borderRadius="$lg">
          <VStack space="md">
            <Heading size="sm" color="$textDark900">
              Merchant Details
            </Heading>
            
            <Divider my="$1" />
            
            <VStack space="xs">
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Merchant ID</Text>
                <Text 
                  color="$primary500" 
                  fontWeight="$medium"
                  onPress={() => navigation.navigate('MIDDetails', { midId: transaction.mid })}
                >
                  {transaction.mid}
                </Text>
              </HStack>
              
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Terminal ID</Text>
                <Text 
                  color="$primary500" 
                  fontWeight="$medium"
                  onPress={() => navigation.navigate('TIDDetails', { 
                    midId: transaction.mid, 
                    tidId: transaction.tid 
                  })}
                >
                  {transaction.tid}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>
        
        {/* Payment Details */}
        <Box bg="$white" p="$4" mb="$4" borderRadius="$lg">
          <VStack space="md">
            <Heading size="sm" color="$textDark900">
              Payment Details
            </Heading>
            
            <Divider my="$1" />
            
            <VStack space="xs">
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Payment Method</Text>
                <Text color="$textDark900" fontWeight="$medium">
                  {transaction.paymentMethod}
                </Text>
              </HStack>
              
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Card Type</Text>
                <Text color="$textDark900" fontWeight="$medium">
                  {transaction.cardType}
                </Text>
              </HStack>
              
              <HStack justifyContent="space-between">
                <Text color="$textLight600" fontSize="$sm">Card Number</Text>
                <Text color="$textDark900" fontWeight="$medium">
                  **** **** **** {transaction.cardLast4}
                </Text>
              </HStack>
              
              {transaction.authCode && (
                <HStack justifyContent="space-between">
                  <Text color="$textLight600" fontSize="$sm">Auth Code</Text>
                  <Text color="$textDark900" fontWeight="$medium">
                    {transaction.authCode}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </Box>
        
        {/* Additional Information */}
        {transaction.additionalInfo && (
          <Box bg="$white" p="$4" mb="$4" borderRadius="$lg">
            <VStack space="md">
              <Heading size="sm" color="$textDark900">
                Additional Information
              </Heading>
              
              <Divider my="$1" />
              
              <VStack space="xs">
                {Object.entries(transaction.additionalInfo).map(([key, value]: [string, any]) => (
                  <HStack key={key} justifyContent="space-between">
                    <Text color="$textLight600" fontSize="$sm">{key}</Text>
                    <Text color="$textDark900" fontWeight="$medium">
                      {value?.toString() || ''}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Box>
        )}
        
        {/* Action Buttons */}
        {transaction.status === 'Success' && (
          <VStack space="md" mb="$4">
            <Button 
              variant="outline" 
              action="secondary"
              onPress={() => navigation.navigate('Main')}
            >
              <ButtonText>View Receipt</ButtonText>
            </Button>
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
});

export default TransactionDetailsScreen; 