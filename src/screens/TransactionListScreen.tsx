import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Pressable,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Icon,
  SearchIcon,
  ChevronDownIcon,
  Center,
  Spinner,
  Badge,
  BadgeText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  Button,
  ButtonText,
  CloseIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp, RoutePropType } from '../navigation/types';
import { dummyData } from '../utils/dummyData';
import { useRoute } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<'TransactionList'>;
};

const TransactionListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<RoutePropType<'TransactionList'>>();
  const { midId, tidId } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [selectedMid, setSelectedMid] = useState<string | undefined>(midId || undefined);
  const [selectedTid, setSelectedTid] = useState<string | undefined>(tidId || undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<string | undefined>(undefined);
  
  // Available options for filters
  const [midOptions, setMidOptions] = useState<string[]>([]);
  const [tidOptions, setTidOptions] = useState<string[]>([]);
  
  useEffect(() => {
    if (user) {
      // Get all MIDs
      const mids = user.mids.map((m: any) => m.mid);
      setMidOptions(mids);
      
      // Get all TIDs from the selected MID or all MIDs
      let tids: string[] = [];
      if (selectedMid) {
        const mid = user.mids.find((m: any) => m.mid === selectedMid);
        if (mid) {
          tids = mid.tids.map((t: any) => t.tid);
        }
      } else {
        user.mids.forEach((m: any) => {
          tids = [...tids, ...m.tids.map((t: any) => t.tid)];
        });
      }
      setTidOptions(tids);
      
      // Filter transactions based on selected filters
      let filteredTransactions = [...dummyData.transactions];
      
      if (selectedMid) {
        filteredTransactions = filteredTransactions.filter(t => t.mid === selectedMid);
      }
      
      if (selectedTid) {
        filteredTransactions = filteredTransactions.filter(t => t.tid === selectedTid);
      }
      
      if (selectedStatus) {
        filteredTransactions = filteredTransactions.filter(t => t.status === selectedStatus);
      }
      
      if (dateFilter) {
        // Implement date filtering logic here
        // For example, filter by today, last 7 days, etc.
        const today = new Date();
        const dateObj = new Date(today);
        
        if (dateFilter === 'today') {
          dateObj.setHours(0, 0, 0, 0);
          filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.timestamp) >= dateObj
          );
        } else if (dateFilter === 'yesterday') {
          dateObj.setDate(dateObj.getDate() - 1);
          dateObj.setHours(0, 0, 0, 0);
          const nextDay = new Date(dateObj);
          nextDay.setDate(nextDay.getDate() + 1);
          
          filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.timestamp) >= dateObj && new Date(t.timestamp) < nextDay
          );
        } else if (dateFilter === 'last7days') {
          dateObj.setDate(dateObj.getDate() - 7);
          dateObj.setHours(0, 0, 0, 0);
          
          filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.timestamp) >= dateObj
          );
        } else if (dateFilter === 'last30days') {
          dateObj.setDate(dateObj.getDate() - 30);
          dateObj.setHours(0, 0, 0, 0);
          
          filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.timestamp) >= dateObj
          );
        }
      }
      
      // Search filtering
      if (searchQuery) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.mid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Sort by date (newest first)
      filteredTransactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setTransactions(filteredTransactions);
      setLoading(false);
    }
  }, [user, selectedMid, selectedTid, selectedStatus, dateFilter, searchQuery]);
  
  const resetFilters = () => {
    setSelectedMid(midId || undefined);
    setSelectedTid(tidId || undefined);
    setSelectedStatus(undefined);
    setDateFilter(undefined);
    setSearchQuery('');
  };

  const renderTransactionItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => navigation.navigate('TransactionDetails', { transactionId: item.id })}
      mb="$3"
    >
      <Box
        bg="$white"
        borderRadius="$lg"
        p="$4"
        borderWidth={1}
        borderColor="$borderLight200"
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <HStack alignItems="center" space="sm">
              <Heading size="sm" color="$textDark900">
                {item.amount} {item.currency}
              </Heading>
            </HStack>
            <Text color="$textLight600" fontSize="$sm" mt="$1">
              {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
            <HStack space="sm" mt="$1">
              <Text color="$textLight600" fontSize="$xs">
                MID: {item.mid}
              </Text>
              <Text color="$textLight600" fontSize="$xs">
                TID: {item.tid}
              </Text>
            </HStack>
          </VStack>
          <Badge
            action={item.status === 'Success' ? 'success' : 'error'}
            variant="outline"
            size="sm"
          >
            <BadgeText>
              {item.status}
            </BadgeText>
          </Badge>
        </HStack>
      </Box>
    </Pressable>
  );

  const renderEmptyList = () => (
    <Center flex={1} height={300}>
      <Text color="$textLight600">No transactions found</Text>
    </Center>
  );

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="large" color="$primary500" />
      </Center>
    );
  }

  return (
    <Box flex={1} bg="$backgroundLight50" safeAreaTop>
      <Box px="$4" pt="$4" pb="$2" bg="$white">
        <HStack alignItems="center" justifyContent="space-between" mb="$4">
          <Heading size="lg" color="$textDark900">
            Transactions
          </Heading>
          <Pressable onPress={() => setShowFilters(!showFilters)}>
            <HStack alignItems="center" space="xs">
              <Icon as={ChevronDownIcon} color="$primary500" size="sm" />
              <Text color="$primary500" fontWeight="$medium">{showFilters ? "Hide Filters" : "Filters"}</Text>
            </HStack>
          </Pressable>
        </HStack>
        
        <Input
          size="md"
          borderWidth={1}
          borderColor="$borderLight300"
          borderRadius="$lg"
          mb={showFilters ? "$4" : "$2"}
          bg="$backgroundLight100"
        >
          <InputSlot pl="$3">
            <InputIcon as={SearchIcon} color="$textLight400" />
          </InputSlot>
          <InputField
            placeholder="Search transactions"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
        
        {/* Filters Section */}
        {showFilters && (
          <VStack space="md" mb="$4">
            <HStack space="sm">
              <Box flex={1}>
                <Text fontSize="$xs" color="$textLight600" mb="$1">Merchant ID</Text>
                <Select
                  selectedValue={selectedMid}
                  onValueChange={(value: string | undefined) => setSelectedMid(value)}
                >
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput placeholder="All MIDs" />
                    <SelectIcon mr="$3">
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="All MIDs" value="" />
                      {midOptions.map((mid) => (
                        <SelectItem key={mid} label={mid} value={mid} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Box>
              
              <Box flex={1}>
                <Text fontSize="$xs" color="$textLight600" mb="$1">Terminal ID</Text>
                <Select
                  selectedValue={selectedTid}
                  onValueChange={(value: string | undefined) => setSelectedTid(value)}
                >
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput placeholder="All TIDs" />
                    <SelectIcon mr="$3">
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="All TIDs" value="" />
                      {tidOptions.map((tid) => (
                        <SelectItem key={tid} label={tid} value={tid} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Box>
            </HStack>
            
            <HStack space="sm">
              <Box flex={1}>
                <Text fontSize="$xs" color="$textLight600" mb="$1">Status</Text>
                <Select
                  selectedValue={selectedStatus}
                  onValueChange={(value: string | undefined) => setSelectedStatus(value)}
                >
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput placeholder="All Status" />
                    <SelectIcon mr="$3">
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="All Status" value="" />
                      <SelectItem label="Success" value="Success" />
                      <SelectItem label="Failed" value="Failed" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Box>
              
              <Box flex={1}>
                <Text fontSize="$xs" color="$textLight600" mb="$1">Date Range</Text>
                <Select
                  selectedValue={dateFilter}
                  onValueChange={(value: string | undefined) => setDateFilter(value)}
                >
                  <SelectTrigger variant="outline" size="md">
                    <SelectInput placeholder="All Time" />
                    <SelectIcon mr="$3">
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="All Time" value="" />
                      <SelectItem label="Today" value="today" />
                      <SelectItem label="Yesterday" value="yesterday" />
                      <SelectItem label="Last 7 Days" value="last7days" />
                      <SelectItem label="Last 30 Days" value="last30days" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Box>
            </HStack>
            
            <Button
              variant="link"
              size="sm"
              onPress={resetFilters}
              alignSelf="flex-end"
            >
              <ButtonText color="$primary600">Reset Filters</ButtonText>
            </Button>
          </VStack>
        )}
      </Box>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
});

export default TransactionListScreen; 