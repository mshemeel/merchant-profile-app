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
  Card,
  Center,
  Spinner,
  Badge,
  BadgeText,
  BadgeIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp, RoutePropType } from '../navigation/types';
import { dummyData } from '../utils/dummyData';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NavigationProp<'TIDDetails'>;
};

const TIDDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<RoutePropType<'TIDDetails'>>();
  const { midId, tidId } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [midData, setMidData] = useState<any>(null);
  const [tidData, setTidData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Find the MID and TID data
      const mid = user.mids.find((m: any) => m.mid === midId);
      if (mid) {
        setMidData(mid);
        // Find TID using either tid or id property
        const tid = mid.tids.find((t: any) => (t.tid === tidId || t.id === tidId));
        if (tid) {
          setTidData(tid);
          
          // For demo purposes, generate some dummy transactions
          const dummyTransactions = generateDummyTransactions(20, midId, tidId);
          setTransactions(dummyTransactions);
        }
      }
      setLoading(false);
    }
  }, [midId, tidId, user]);

  const generateDummyTransactions = (count: number, mid: string, tid: string) => {
    const statuses = ['success', 'failed', 'pending'];
    const types = ['purchase', 'refund', 'auth', 'void'];
    
    return Array.from({ length: count }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = Math.floor(Math.random() * 100000) / 100;
      
      // Random date in the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id: `txn-${i}`,
        mid,
        tid,
        status,
        type,
        amount,
        currency: 'AED',
        date,
        cardType: ['Visa', 'MasterCard', 'Amex', 'Discover'][Math.floor(Math.random() * 4)],
        last4: `${Math.floor(1000 + Math.random() * 9000)}`,
      };
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'AED') => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  // Format date
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(t => t.status === 'success').length;
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
    
    return {
      totalTransactions,
      successfulTransactions,
      totalVolume,
      successRate,
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Center flex={1}>
          <Spinner size="large" color="$primary500" />
        </Center>
      </SafeAreaView>
    );
  }

  if (!tidData || !midData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Center flex={1}>
          <Text color="$textLight600">TID not found</Text>
        </Center>
      </SafeAreaView>
    );
  }

  const stats = calculateStats();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Box>
          {/* Header */}
          <Box px="$5" pt="$5" pb="$5" bg="$white" borderBottomWidth={1} borderBottomColor="$borderLight200">
            <VStack>
              <HStack alignItems="center" space="sm" mb="$2">
                <Heading size="xl">{tidData.tid || tidData.id}</Heading>
                <Badge
                  action={tidData.status === 'active' ? 'success' : 'error'}
                  variant="outline"
                  size="md"
                >
                  <BadgeText>
                    {tidData.status}
                  </BadgeText>
                  <BadgeIcon as={tidData.status === 'active' ? CheckCircleIcon : AlertCircleIcon} ml="$1" />
                </Badge>
              </HStack>
              <Text color="$textLight600" fontSize="$md">
                MID: {midData.mid}
              </Text>
            </VStack>
          </Box>

          {/* Terminal Details */}
          <Box px="$5" py="$5" bg="$white" mt="$2" borderBottomWidth={1} borderBottomColor="$borderLight200">
            <Heading size="md" mb="$4">Terminal Details</Heading>
            <VStack space="md">
              <HStack justifyContent="space-between">
                <Text color="$textLight600">Device Type</Text>
                <Text color="$textDark900" fontWeight="$medium">{tidData.deviceType || 'Terminal'}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="$textLight600">Activation Date</Text>
                <Text color="$textDark900" fontWeight="$medium">{formatDate(tidData.activationDate)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="$textLight600">Location</Text>
                <Text color="$textDark900" fontWeight="$medium">{tidData.location || 'Main Branch'}</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Transaction Statistics */}
          <Box px="$5" py="$5" bg="$white" mt="$2" borderBottomWidth={1} borderBottomColor="$borderLight200">
            <Heading size="md" mb="$4">Transaction Statistics</Heading>
            <VStack space="md">
              <HStack justifyContent="space-between">
                <Text color="$textLight600">Total Volume</Text>
                <Text color="$textDark900" fontWeight="$medium">{formatCurrency(stats.totalVolume)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="$textLight600">Total Transactions</Text>
                <Text color="$textDark900" fontWeight="$medium">{stats.totalTransactions}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="$textLight600">Success Rate</Text>
                <Text color="$textDark900" fontWeight="$medium">{stats.successRate.toFixed(1)}%</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Recent Transactions */}
          <Box px="$5" py="$5" bg="$white" mt="$2">
            <HStack justifyContent="space-between" alignItems="center" mb="$4">
              <Heading size="md">Recent Transactions</Heading>
              <Button
                size="sm"
                variant="outline"
                onPress={() => navigation.navigate('TransactionList', { midId, tidId })}
              >
                <ButtonText>View All</ButtonText>
              </Button>
            </HStack>
            
            <VStack space="md">
              {transactions.slice(0, 5).map((transaction, index) => (
                <Box key={transaction.id}>
                  <HStack justifyContent="space-between" alignItems="flex-start">
                    <VStack>
                      <HStack alignItems="center" space="sm">
                        <Text color="$textDark900" fontWeight="$medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </Text>
                        <Badge
                          action={transaction.status === 'success' ? 'success' : transaction.status === 'pending' ? 'warning' : 'error'}
                          variant="outline"
                          size="sm"
                        >
                          <BadgeText>
                            {transaction.status}
                          </BadgeText>
                        </Badge>
                      </HStack>
                      <Text color="$textLight600" fontSize="$xs">
                        {transaction.cardType} •••• {transaction.last4}
                      </Text>
                      <Text color="$textLight500" fontSize="$xs">
                        {formatDate(transaction.date)}
                      </Text>
                    </VStack>
                    <Badge variant="outline" size="sm" action="muted">
                      <BadgeText>{transaction.type}</BadgeText>
                    </Badge>
                  </HStack>
                  {index < transactions.slice(0, 5).length - 1 && <Divider my="$3" />}
                </Box>
              ))}
              
              {transactions.length === 0 && (
                <Center height={100}>
                  <Text color="$textLight600">No transactions found</Text>
                </Center>
              )}
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
});

export default TIDDetailsScreen; 