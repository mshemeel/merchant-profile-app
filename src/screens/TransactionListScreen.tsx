import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
  ChevronRightIcon,
  Center,
  Spinner,
  Badge,
  BadgeText,
  BadgeIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  CloseIcon,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  ChevronDownIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  navigation: NavigationProp<'TransactionList'>;
};

const TransactionListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMID, setSelectedMID] = useState<string>('');
  const [selectedTID, setSelectedTID] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Use useMemo to prevent recreating these on every render
  const mids = useMemo(() => user?.mids || [], [user]);
  const tids = useMemo(() => {
    // Filter out any undefined or invalid tids
    const allTids = mids.flatMap((mid: any) => mid.tids || []);
    return allTids.filter((tid: any) => tid && (tid.tid || tid.id));
  }, [mids]);
  
  // Memoize the generateSampleTransactions function
  const generateSampleTransactions = useMemo(() => {
    return (count: number, mids: any[], tids: any[]) => {
      const statuses = ['success', 'failed', 'pending'];
      const types = ['purchase', 'refund', 'auth', 'void'];
      
      // Create an array of valid MID/TID combinations from the data
      type Combination = { mid: string; tid: string };
      const validCombinations: Combination[] = [];
      
      mids.forEach((mid: any) => {
        if (mid.tids && mid.tids.length > 0) {
          mid.tids.forEach((tid: any) => {
            validCombinations.push({
              mid: mid.mid,
              tid: tid.tid || tid.id
            });
          });
        }
      });
      
      // If no valid combinations, return empty array
      if (validCombinations.length === 0) return [];
      
      return Array.from({ length: count }, (_, i) => {
        // Use a valid MID/TID combination instead of random selection
        const combination = validCombinations[i % validCombinations.length];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const amount = Math.floor(Math.random() * 100000) / 100;
        
        // Random date in the last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        return {
          id: `txn-${i}`,
          mid: combination.mid,
          tid: combination.tid,
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
  }, []);

  // Get sample transactions for demo
  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    
    // Simulating API call with timeout
    const timer = setTimeout(() => {
      const sampleTransactions = generateSampleTransactions(100, mids, tids);
      setTransactions(sampleTransactions);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, mids, tids, generateSampleTransactions]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Center flex={1}>
          <Spinner size="large" color="$primary500" />
        </Center>
      </SafeAreaView>
    );
  }

  const applyFilters = () => {
    setShowFilterModal(false);
    // Filtering is handled in the filteredTransactions calculation
  };

  const resetFilters = () => {
    setSelectedMID('');
    setSelectedTID('');
    setSelectedStatus('');
    setStartDate(null);
    setEndDate(null);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    let matchesSearch = true;
    let matchesMID = true;
    let matchesTID = true;
    let matchesStatus = true;
    let matchesDateRange = true;
    
    // Search filter
    if (searchQuery) {
      matchesSearch = 
        transaction.mid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.tid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery) ||
        transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.cardType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.last4.includes(searchQuery);
    }
    
    // MID filter
    if (selectedMID) {
      matchesMID = transaction.mid === selectedMID;
    }
    
    // TID filter
    if (selectedTID) {
      matchesTID = transaction.tid === selectedTID;
    }
    
    // Status filter
    if (selectedStatus) {
      matchesStatus = transaction.status === selectedStatus;
    }
    
    // Date range filter
    if (startDate) {
      matchesDateRange = matchesDateRange && transaction.date >= startDate;
    }
    
    if (endDate) {
      const endDateCopy = new Date(endDate);
      endDateCopy.setDate(endDateCopy.getDate() + 1); // Include the end date
      matchesDateRange = matchesDateRange && transaction.date < endDateCopy;
    }
    
    return matchesSearch && matchesMID && matchesTID && matchesStatus && matchesDateRange;
  });

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'AED') => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Memoize the renderTransactionItem function to improve performance
  const renderTransactionItem = useCallback(({ item }: { item: any }) => (
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
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack>
            <HStack alignItems="center" space="sm" mb="$1">
              <Heading size="xs" color="$textDark900">
                {formatCurrency(item.amount, item.currency)}
              </Heading>
              <Badge
                action={item.status === 'success' ? 'success' : item.status === 'pending' ? 'warning' : 'error'}
                variant="outline"
                size="sm"
              >
                <BadgeText>
                  {item.status}
                </BadgeText>
                <BadgeIcon as={
                  item.status === 'success' ? CheckCircleIcon : 
                  item.status === 'pending' ? AlertCircleIcon : 
                  AlertCircleIcon
                } ml="$1" />
              </Badge>
            </HStack>
            <Text color="$textLight600" fontSize="$xs">
              {item.cardType} •••• {item.last4}
            </Text>
            <Text color="$textLight600" fontSize="$xs" mt="$1">
              MID: {item.mid} | TID: {item.tid}
            </Text>
            <HStack alignItems="center" mt="$1">
              <Badge variant="outline" size="sm" action="muted">
                <BadgeText>{item.type}</BadgeText>
              </Badge>
              <Text color="$textLight500" fontSize="$xs" ml="$2">
                {formatDate(item.date)}
              </Text>
            </HStack>
          </VStack>
          <Icon as={ChevronRightIcon} color="$primary500" size="sm" />
        </HStack>
      </Box>
    </Pressable>
  ), [navigation, formatCurrency, formatDate]);

  const renderEmptyList = () => (
    <Center flex={1} height={300}>
      <Text color="$textLight600">No transactions found</Text>
    </Center>
  );

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="$backgroundLight50">
        <Box px="$4" pt="$4" pb="$2" bg="$white">
          <HStack justifyContent="space-between" alignItems="center" mb="$4">
            <Heading size="lg" color="$textDark900">
              Transactions
            </Heading>
            <Button
              size="sm"
              variant="outline"
              onPress={() => setShowFilterModal(true)}
            >
              <ButtonText>Filter</ButtonText>
            </Button>
          </HStack>
          <Input
            size="md"
            borderWidth={1}
            borderColor="$borderLight300"
            borderRadius="$lg"
            mb="$4"
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
        </Box>

        {loading ? (
          <Center flex={1}>
            <Spinner size="large" color="$primary500" />
          </Center>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            initialNumToRender={10}
          />
        )}

        <Modal 
          isOpen={showFilterModal} 
          onClose={() => setShowFilterModal(false)}
          avoidKeyboard={true}
        >
          <ModalBackdrop />
          <ModalContent maxHeight="80%">
            <ModalHeader>
              <Heading size="md">Filter Transactions</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <VStack space="md">
                <Box>
                  <Text mb="$2">Merchant ID</Text>
                  <Select
                    selectedValue={selectedMID}
                    onValueChange={(value) => setSelectedMID(value)}
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="Select MID" />
                      <SelectIcon>
                        <Icon as={ChevronDownIcon} />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent key="mid-select-content">
                        <SelectItem key="all-mids" id="all-mids" label="All MIDs" value="" />
                        {mids.map((mid: any) => (
                          <SelectItem 
                            key={`mid-${mid.mid}`}
                            id={`mid-${mid.mid}`}
                            label={mid.mid} 
                            value={mid.mid} 
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </Box>
                
                <Box>
                  <Text mb="$2">Terminal ID</Text>
                  <Select
                    selectedValue={selectedTID}
                    onValueChange={(value) => setSelectedTID(value)}
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="Select TID" />
                      <SelectIcon>
                        <Icon as={ChevronDownIcon} />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent key="tid-select-content">
                        <SelectItem key="all-tids" id="all-tids" label="All TIDs" value="" />
                        {tids.map((tid: any, index: number) => {
                          const tidValue = tid.tid || tid.id || '';
                          // Skip rendering items with empty tidValue
                          if (!tidValue) return null;
                          
                          return (
                            <SelectItem 
                              key={`tid-${tidValue}-${index}`}
                              id={`tid-${tidValue}-${index}`}
                              label={tidValue} 
                              value={tidValue} 
                            />
                          );
                        })}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </Box>
                
                <Box>
                  <Text mb="$2">Status</Text>
                  <Select
                    selectedValue={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="Select status" />
                      <SelectIcon>
                        <Icon as={ChevronDownIcon} />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent key="status-select-content">
                        <SelectItem key="all-statuses" id="all-statuses" label="All statuses" value="" />
                        <SelectItem key="status-success" id="status-success" label="Success" value="success" />
                        <SelectItem key="status-failed" id="status-failed" label="Failed" value="failed" />
                        <SelectItem key="status-pending" id="status-pending" label="Pending" value="pending" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </Box>
                
                <Box>
                  <Text mb="$2">Date Range</Text>
                  <HStack space="sm">
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
                      <Text>{startDate ? formatDate(startDate) : 'Start Date'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
                      <Text>{endDate ? formatDate(endDate) : 'End Date'}</Text>
                    </TouchableOpacity>
                  </HStack>
                  {showStartDatePicker && (
                    <DateTimePicker
                      testID="startDatePicker"
                      value={startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                  {showEndDatePicker && (
                    <DateTimePicker
                      testID="endDatePicker"
                      value={endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                    />
                  )}
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" size="sm" mr="$3" onPress={resetFilters}>
                <ButtonText>Reset</ButtonText>
              </Button>
              <Button size="sm" onPress={applyFilters}>
                <ButtonText>Apply</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  dateButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default TransactionListScreen; 