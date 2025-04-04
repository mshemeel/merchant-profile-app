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
  BadgeIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { NavigationProp, RoutePropType } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NavigationProp<'TIDList'>;
};

const TIDListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const route = useRoute<RoutePropType<'TIDList'>>();
  const { midId } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Center flex={1}>
          <Spinner size="large" color="$primary500" />
        </Center>
      </SafeAreaView>
    );
  }

  // Find the MID from the user data
  const mid = user.mids.find((m: any) => m.mid === midId);
  
  if (!mid) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Center flex={1}>
          <Text color="$textLight600">MID not found</Text>
        </Center>
      </SafeAreaView>
    );
  }

  const tids = mid.tids || [];
  
  // Ensure tids array exists
  if (!Array.isArray(tids)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Center flex={1}>
          <Text color="$textLight600">No Terminal IDs available</Text>
        </Center>
      </SafeAreaView>
    );
  }

  const filteredTIDs = tids.filter(
    (tid: any) => {
      // Add null checks to prevent errors
      if (!tid || (!tid.id && !tid.tid)) return false;
      const tidValue = tid.tid || tid.id; // Support both property names
      return tidValue.toString().toLowerCase().includes((searchQuery || '').toLowerCase());
    }
  );

  // Format date
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTIDItem = ({ item }: { item: any }) => {
    if (!item || (!item.id && !item.tid)) return null;
    
    const tidValue = item.tid || item.id; // Support both property names
    
    return (
      <Pressable
        onPress={() => navigation.navigate('TIDDetails', { midId: midId, tidId: tidValue })}
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
                  {tidValue}
                </Heading>
                <Badge
                  action={item.status === 'active' ? 'success' : 'error'}
                  variant="outline"
                  size="sm"
                >
                  <BadgeText>
                    {item.status || 'unknown'}
                  </BadgeText>
                  <BadgeIcon as={item.status === 'active' ? CheckCircleIcon : AlertCircleIcon} ml="$1" />
                </Badge>
              </HStack>
              <Text color="$textLight600" fontSize="$sm" mt="$1">
                Activated: {formatDate(item.activationDate)}
              </Text>
              <Text color="$textLight600" fontSize="$xs" mt="$1">
                {item.deviceType || 'Terminal'} 
              </Text>
            </VStack>
            <Icon as={ChevronRightIcon} color="$primary500" size="lg" />
          </HStack>
        </Box>
      </Pressable>
    );
  };

  const renderEmptyList = () => (
    <Center flex={1} height={300}>
      <Text color="$textLight600">No TIDs found</Text>
    </Center>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="$backgroundLight50">
        <Box px="$4" pt="$4" pb="$2" bg="$white">
          <Heading size="lg" color="$textDark900" mb="$2">
            Terminal IDs
          </Heading>
          <Text color="$textLight600" mb="$4">
            MID: {midId}
          </Text>
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
              placeholder="Search TIDs"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </Box>

        <FlatList
          data={filteredTIDs}
          renderItem={renderTIDItem}
          keyExtractor={(item) => item.tid || item.id || String(Math.random())}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
        />
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
});

export default TIDListScreen; 