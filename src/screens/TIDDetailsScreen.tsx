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
  AlertCircleIcon,
  CheckCircleIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp, RoutePropType } from '../navigation/types';
import { dummyData } from '../utils/dummyData';
import { useRoute } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<'TIDDetails'>;
};

const TIDDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<RoutePropType<'TIDDetails'>>();
  const { midId, tidId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [midData, setMidData] = useState<any>(null);
  const [tidData, setTidData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Find MID in user data
      const mid = user.mids.find((m: any) => m.mid === midId);
      
      if (mid) {
        setMidData(mid);
        
        // Find TID in MID data
        const tid = mid.tids.find((t: any) => t.tid === tidId);
        
        if (tid) {
          setTidData(tid);
          
          // Get transactions for this TID
          const tidTransactions = dummyData.transactions.filter(
            (trans) => trans.mid === midId && trans.tid === tidId
          );
          setTransactions(tidTransactions);
        }
      }
      
      setLoading(false);
    }
  }, [midId, tidId, user]);

  const navigateToTransactions = () => {
    navigation.navigate('TransactionList', { midId, tidId });
  };

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="large" color="$primary500" />
      </Center>
    );
  }

  if (!midData || !tidData) {
    return (
      <Center flex={1}>
        <Text color="$error700">Terminal ID not found</Text>
      </Center>
    );
  }

  const getStatusBadge = (status: string) => (
    <Badge
      action={status === 'active' ? 'success' : 'error'}
      variant="solid"
      size="md"
    >
      <BadgeText>{status.toUpperCase()}</BadgeText>
      <Badge.Icon as={status === 'active' ? CheckCircleIcon : AlertCircleIcon} ml="$1" />
    </Badge>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-AE', {
      style: 'currency',
      currency: 'AED',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <Box bg="$white" p="$6" borderRadius="$lg" mb="$4">
        <VStack space="md">
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Heading size="lg" color="$textDark900">
                {tidData.tid}
              </Heading>
              <Text color="$textLight600" fontSize="$sm">
                Merchant ID: {midId}
              </Text>
            </VStack>
            {getStatusBadge(tidData.status)}
          </HStack>
          
          <Divider my="$2" />
          
          <VStack space="sm">
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Payment Channel</Text>
              <Text color="$textDark900" fontWeight="$medium">
                {midData.paymentChannel}
              </Text>
            </HStack>
            
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Activation Date</Text>
              <Text color="$textDark900">
                {formatDate(tidData.activationDate)}
              </Text>
            </HStack>
            
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Total Transactions</Text>
              <Text color="$textDark900" fontWeight="$semibold">
                {tidData.totalTransactions}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Transaction Stats */}
      <Box bg="$white" p="$6" borderRadius="$lg" mb="$4">
        <Heading size="sm" color="$textDark900" mb="$4">
          Transaction Statistics
        </Heading>
        
        <HStack justifyContent="space-between" mb="$4">
          <Box 
            flex={1} 
            bg="$primary50" 
            p="$4" 
            borderRadius="$lg" 
            mr="$2"
            alignItems="center"
          >
            <Text fontSize="$xs" color="$textLight600">Total Volume</Text>
            <Heading size="md" color="$primary800">
              {formatCurrency(
                transactions
                  .filter(t => t.status === 'Success')
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                  .toString()
              )}
            </Heading>
          </Box>
          
          <Box 
            flex={1} 
            bg="$success50" 
            p="$4" 
            borderRadius="$lg" 
            ml="$2"
            alignItems="center"
          >
            <Text fontSize="$xs" color="$textLight600">Success Rate</Text>
            <Heading size="md" color="$success700">
              {transactions.length 
                ? Math.round((transactions.filter(t => t.status === 'Success').length / transactions.length) * 100)
                : 0}%
            </Heading>
          </Box>
        </HStack>
      </Box>

      {/* Recent Transactions Section */}
      <Box bg="$white" p="$6" borderRadius="$lg" mb="$4">
        <HStack justifyContent="space-between" alignItems="center" mb="$4">
          <Heading size="sm" color="$textDark900">
            Recent Transactions
          </Heading>
          <Text color="$primary500" fontWeight="$semibold">
            {transactions.length} Transactions
          </Text>
        </HStack>

        {transactions.length > 0 ? (
          <VStack space="md">
            {transactions.slice(0, 3).map((transaction: any, index: number) => (
              <VStack key={transaction.id}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text fontSize="$md" fontWeight="$semibold" color="$textDark900">
                      {transaction.amount} {transaction.currency}
                    </Text>
                    <Text fontSize="$xs" color="$textLight600">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <Badge
                    action={transaction.status === 'Success' ? 'success' : 'error'}
                    variant="outline"
                    size="sm"
                  >
                    <BadgeText>{transaction.status}</BadgeText>
                  </Badge>
                </HStack>
                {index < transactions.slice(0, 3).length - 1 && <Divider my="$3" />}
              </VStack>
            ))}
          </VStack>
        ) : (
          <Center py="$4">
            <Text color="$textLight600">No transactions found</Text>
          </Center>
        )}

        <Button
          onPress={navigateToTransactions}
          variant="outline"
          mt="$4"
          size="sm"
          borderColor="$primary500"
        >
          <ButtonText color="$primary500">View All Transactions</ButtonText>
        </Button>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    padding: 16,
  },
});

export default TIDDetailsScreen; 