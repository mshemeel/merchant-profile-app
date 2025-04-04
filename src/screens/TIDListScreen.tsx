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
  ChevronRightIcon,
  Center,
  Spinner,
  Badge,
  BadgeText,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp, RoutePropType } from '../navigation/types';
import { useRoute } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<'TIDList'>;
};

const TIDListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<RoutePropType<'TIDList'>>();
  const { midId } = route.params;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [midData, setMidData] = useState<any>(null);
  const [tids, setTids] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Find the MID
      const mid = user.mids.find((m: any) => m.mid === midId);
      
      if (mid) {
        setMidData(mid);
        setTids(mid.tids);
      }
      
      setLoading(false);
    }
  }, [midId, user]);

  const filteredTIDs = tids.filter(
    (tid: any) => tid.tid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderTIDItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => navigation.navigate('TIDDetails', { midId, tidId: item.tid })}
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
                {item.tid}
              </Heading>
              <Badge
                action={item.status === 'active' ? 'success' : 'error'}
                variant="outline"
                size="sm"
              >
                <BadgeText>
                  {item.status}
                </BadgeText>
              </Badge>
            </HStack>
            <Text color="$textLight600" fontSize="$sm" mt="$1">
              Activated: {formatDate(item.activationDate)}
            </Text>
            <Text color="$textLight600" fontSize="$xs" mt="$1">
              {item.totalTransactions} Transactions
            </Text>
          </VStack>
          <Icon as={ChevronRightIcon} color="$primary500" size="lg" />
        </HStack>
      </Box>
    </Pressable>
  );

  const renderEmptyList = () => (
    <Center flex={1} height={300}>
      <Text color="$textLight600">No Terminal IDs found</Text>
    </Center>
  );

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

  return (
    <Box flex={1} bg="$backgroundLight50" safeAreaTop>
      <Box px="$4" pt="$4" pb="$2" bg="$white">
        <HStack alignItems="center" mb="$4">
          <Heading size="lg" color="$textDark900">
            Terminal IDs
          </Heading>
          <Badge ml="$2" bg="$primary100">
            <BadgeText color="$primary800">{midData.mid}</BadgeText>
          </Badge>
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
            placeholder="Search terminal IDs"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </Box>

      <FlatList
        data={filteredTIDs}
        renderItem={renderTIDItem}
        keyExtractor={(item) => item.tid}
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

export default TIDListScreen; 