import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Pressable,
  Card,
  Avatar,
  AvatarFallbackText,
  Button,
  ButtonText,
  Divider,
  Center,
  Spinner,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp } from '../navigation/types';
import { dummyData } from '../utils/dummyData';

type Props = {
  navigation: NavigationProp<'Main'>;
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [summaryData, setSummaryData] = useState(dummyData.summary);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  if (!user) {
    return (
      <Center flex={1}>
        <Spinner size="large" color="$primary500" />
      </Center>
    );
  }

  const totalMids = user.mids.length;
  const activeMids = user.mids.filter((mid: any) => mid.status === 'active').length;
  
  // Calculate total TIDs
  let totalTids = 0;
  user.mids.forEach((mid: any) => {
    totalTids += mid.tids.length;
  });

  return (
    <Box flex={1} bg="$backgroundLight50" safeAreaTop>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Merchant Header */}
        <Box bg="$primary500" p="$4" borderRadius="$lg" mb="$4">
          <HStack space="md" alignItems="center">
            <Avatar size="lg" bg="$primary300">
              <AvatarFallbackText>{user.merchantName}</AvatarFallbackText>
            </Avatar>
            <VStack flex={1}>
              <Heading color="$white" size="md">
                {user.merchantName}
              </Heading>
              <Text color="$white:alpha.80" fontSize="$sm">
                Welcome back!
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Merchant Stats */}
        <HStack space="md" mb="$4">
          <Card flex={1} p="$4" bg="$white" borderRadius="$lg">
            <VStack alignItems="center">
              <Heading size="md" color="$primary500">
                {totalMids}
              </Heading>
              <Text fontSize="$xs" color="$textLight500" textAlign="center">
                Total MIDs
              </Text>
            </VStack>
          </Card>
          <Card flex={1} p="$4" bg="$white" borderRadius="$lg">
            <VStack alignItems="center">
              <Heading size="md" color="$success600">
                {activeMids}
              </Heading>
              <Text fontSize="$xs" color="$textLight500" textAlign="center">
                Active MIDs
              </Text>
            </VStack>
          </Card>
          <Card flex={1} p="$4" bg="$white" borderRadius="$lg">
            <VStack alignItems="center">
              <Heading size="md" color="$info600">
                {totalTids}
              </Heading>
              <Text fontSize="$xs" color="$textLight500" textAlign="center">
                Terminal IDs
              </Text>
            </VStack>
          </Card>
        </HStack>

        {/* Transaction Summary */}
        <Card p="$4" bg="$white" borderRadius="$lg" mb="$4">
          <VStack space="md">
            <Heading size="sm" color="$textDark900">
              Transaction Summary
            </Heading>
            <Divider />
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text fontSize="$xs" color="$textLight500">
                  Total Sales
                </Text>
                <Heading size="md" color="$textDark900">
                  AED {summaryData.totalSales.toFixed(2)}
                </Heading>
              </VStack>
              <Button
                size="sm"
                variant="outline"
                onPress={() => navigation.navigate('TransactionList', {})}
              >
                <ButtonText>View All</ButtonText>
              </Button>
            </HStack>
            <HStack justifyContent="space-between">
              <VStack alignItems="center" flex={1}>
                <Text fontSize="$xs" color="$textLight500">
                  Transactions
                </Text>
                <Heading size="sm" color="$textDark900">
                  {summaryData.totalTransactions}
                </Heading>
              </VStack>
              <VStack alignItems="center" flex={1}>
                <Text fontSize="$xs" color="$textLight500">
                  Successful
                </Text>
                <Heading size="sm" color="$success600">
                  {summaryData.successfulTransactions}
                </Heading>
              </VStack>
              <VStack alignItems="center" flex={1}>
                <Text fontSize="$xs" color="$textLight500">
                  Failed
                </Text>
                <Heading size="sm" color="$error600">
                  {summaryData.failedTransactions}
                </Heading>
              </VStack>
            </HStack>
          </VStack>
        </Card>

        {/* Quick Access */}
        <Card p="$4" bg="$white" borderRadius="$lg" mb="$4">
          <VStack space="md">
            <Heading size="sm" color="$textDark900">
              Quick Access
            </Heading>
            <Divider />
            <HStack space="sm">
              <Pressable
                flex={1}
                bg="$primary50"
                p="$3"
                borderRadius="$lg"
                onPress={() => navigation.navigate('MIDList')}
              >
                <VStack alignItems="center">
                  <Box
                    w="$10"
                    h="$10"
                    bg="$primary100"
                    borderRadius="$full"
                    alignItems="center"
                    justifyContent="center"
                    mb="$2"
                  />
                  <Text color="$primary700" fontSize="$xs" textAlign="center">
                    View MIDs
                  </Text>
                </VStack>
              </Pressable>
              <Pressable
                flex={1}
                bg="$secondary50"
                p="$3"
                borderRadius="$lg"
                onPress={() => navigation.navigate('TransactionList', {})}
              >
                <VStack alignItems="center">
                  <Box
                    w="$10"
                    h="$10"
                    bg="$secondary100"
                    borderRadius="$full"
                    alignItems="center"
                    justifyContent="center"
                    mb="$2"
                  />
                  <Text color="$secondary700" fontSize="$xs" textAlign="center">
                    Transactions
                  </Text>
                </VStack>
              </Pressable>
            </HStack>
          </VStack>
        </Card>
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

export default DashboardScreen; 