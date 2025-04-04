import React, { useState } from 'react';
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
  ChevronRightIcon,
  Center,
  Spinner,
  Badge,
  BadgeText,
  BadgeIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp } from '../navigation/types';

type Props = {
  navigation: NavigationProp<'MIDList'>;
};

const MIDListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Center flex={1}>
        <Spinner size="large" color="$primary500" />
      </Center>
    );
  }

  const mids = user.mids;

  const filteredMIDs = mids.filter(
    (mid: any) =>
      mid.mid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mid.paymentChannel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMIDItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => navigation.navigate('MIDDetails', { midId: item.mid })}
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
                {item.mid}
              </Heading>
              <Badge
                action={item.status === 'active' ? 'success' : 'error'}
                variant="outline"
                size="sm"
              >
                <BadgeText>
                  {item.status}
                </BadgeText>
                <BadgeIcon as={item.status === 'active' ? CheckCircleIcon : AlertCircleIcon} ml="$1" />
              </Badge>
            </HStack>
            <Text color="$textLight600" fontSize="$sm" mt="$1">
              {item.paymentChannel}
            </Text>
            <Text color="$textLight600" fontSize="$xs" mt="$1">
              {item.tids.length} Terminal IDs
            </Text>
          </VStack>
          <Icon as={ChevronRightIcon} color="$primary500" size="lg" />
        </HStack>
      </Box>
    </Pressable>
  );

  const renderEmptyList = () => (
    <Center flex={1} height={300}>
      <Text color="$textLight600">No MIDs found</Text>
    </Center>
  );

  return (
    <Box flex={1} bg="$backgroundLight50" safeAreaTop>
      <Box px="$4" pt="$4" pb="$2" bg="$white">
        <Heading size="lg" color="$textDark900" mb="$4">
          Merchant IDs
        </Heading>
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
            placeholder="Search MIDs or payment channels"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </Box>

      <FlatList
        data={filteredMIDs}
        renderItem={renderMIDItem}
        keyExtractor={(item) => item.mid}
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

export default MIDListScreen; 