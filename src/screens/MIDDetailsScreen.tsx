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
  ButtonIcon,
  Card,
  Icon,
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
  navigation: NavigationProp<'MIDDetails'>;
};

const MIDDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<RoutePropType<'MIDDetails'>>();
  const { midId } = route.params;
  const [loading, setLoading] = useState(true);
  const [midData, setMidData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Find MID in user data
      const mid = user.mids.find((m: any) => m.mid === midId);
      
      if (mid) {
        setMidData(mid);
        // Get transactions for this MID
        const midTransactions = dummyData.transactions.filter(
          (trans) => trans.mid === midId
        );
        setTransactions(midTransactions);
      }
      
      setLoading(false);
    }
  }, [midId, user]);

  const navigateToTIDs = () => {
    navigation.navigate('TIDList', { midId });
  };

  const navigateToTransactions = () => {
    navigation.navigate('TransactionList', { midId });
  };

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="large" color="$primary500" />
      </Center>
    );
  }

  if (!midData) {
    return (
      <Center flex={1}>
        <Text color="$error700">MID not found</Text>
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <Box bg="$white" p="$6" borderRadius="$lg" mb="$4">
        <VStack space="md">
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="lg" color="$textDark900">
              {midData.mid}
            </Heading>
            {getStatusBadge(midData.status)}
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
              <Text color="$textLight600">Created Date</Text>
              <Text color="$textDark900">
                {formatDate(midData.createdDate)}
              </Text>
            </HStack>
            
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Total Transactions</Text>
              <Text color="$textDark900" fontWeight="$semibold">
                {midData.totalTransactions}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Terminal IDs Section */}
      <Box bg="$white" p="$6" borderRadius="$lg" mb="$4">
        <HStack justifyContent="space-between" alignItems="center" mb="$4">
          <Heading size="sm" color="$textDark900">
            Terminal IDs
          </Heading>
          <Text color="$primary500" fontWeight="$semibold">
            {midData.tids.length} TIDs
          </Text>
        </HStack>

        {midData.tids.length > 0 ? (
          <VStack space="md">
            {midData.tids.slice(0, 2).map((tid: any, index: number) => (
              <VStack key={tid.tid}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text fontSize="$md" fontWeight="$semibold" color="$textDark900">
                      {tid.tid}
                    </Text>
                    <Text fontSize="$xs" color="$textLight600">
                      Activated: {formatDate(tid.activationDate)}
                    </Text>
                  </VStack>
                  <Badge
                    action={tid.status === 'active' ? 'success' : 'error'}
                    variant="outline"
                    size="sm"
                  >
                    <BadgeText>{tid.status}</BadgeText>
                  </Badge>
                </HStack>
                {index < midData.tids.slice(0, 2).length - 1 && <Divider my="$3" />}
              </VStack>
            ))}
          </VStack>
        ) : (
          <Center py="$4">
            <Text color="$textLight600">No Terminal IDs found</Text>
          </Center>
        )}

        <Button
          onPress={navigateToTIDs}
          variant="outline"
          mt="$4"
          size="sm"
          borderColor="$primary500"
        >
          <ButtonText color="$primary500">View All Terminal IDs</ButtonText>
        </Button>
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
                      {new Date(transaction.timestamp).toLocaleDateString()} • {transaction.tid}
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

export default MIDDetailsScreen; 