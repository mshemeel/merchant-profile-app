import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Animated, Platform, View } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Center,
  ScrollView,
  Divider,
  Button,
  ButtonText,
  Pressable,
  Badge,
  BadgeText,
  BadgeIcon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp, TabNavigationProp } from '../navigation/types';
import { CheckCircleIcon, ArrowRightIcon } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type DashboardScreenProps = {
  navigation: CompositeNavigationProp<
    TabNavigationProp<'Dashboard'>,
    NavigationProp<'Main'>
  >;
};

// Get device dimensions for responsive scaling
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideLeftAnim = useState(new Animated.Value(50))[0];
  const slideRightAnim = useState(new Animated.Value(50))[0];
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideLeftAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideRightAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Summary data
  const summaryData = {
    totalMIDs: 5,
    activeMIDs: 4,
    totalTIDs: 12,
    activeTIDs: 10,
    recentTransactions: 156,
    successRate: 98.2,
  };

  const handleViewAllMIDs = () => {
    // Navigate to the MIDs tab screen
    navigation.navigate('MIDs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="$backgroundLight50">
        <ScrollView 
          flex={1} 
          bg="$white" 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Box p={isSmallDevice ? '$3' : '$5'} flex={1}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <HStack justifyContent="space-between" alignItems="center" mb="$4">
                <VStack>
                  <Heading size={isSmallDevice ? 'lg' : 'xl'} color="$textLight900">
                    Dashboard
                  </Heading>
                  <Text color="$textLight500" size={isSmallDevice ? 'sm' : 'md'}>
                    Welcome back, {user?.name || 'Merchant'}
                  </Text>
                </VStack>
                <Pressable
                  onPress={logout}
                  bg="$error100"
                  py="$1.5"
                  px="$3"
                  borderRadius="$full"
                >
                  <HStack space="xs" alignItems="center">
                    <Ionicons name="log-out-outline" color="#DC2626" size={20} />
                    <Text color="$error700" fontWeight="$medium" size={isSmallDevice ? 'xs' : 'sm'}>
                      Logout
                    </Text>
                  </HStack>
                </Pressable>
              </HStack>
            </Animated.View>

            <Animated.View 
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideLeftAnim }]
              }}
            >
              <Box
                bg="$primary100"
                p={isSmallDevice ? '$3' : '$4'}
                borderRadius="$lg"
                mb="$5"
                borderLeftWidth={4}
                borderLeftColor="$primary500"
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text color="$textLight600" mb="$1" size={isSmallDevice ? 'xs' : 'sm'}>
                      Merchant ID
                    </Text>
                    <Heading size={isSmallDevice ? 'md' : 'lg'} color="$textLight900">
                      {user?.merchantId || 'MID123456789'}
                    </Heading>
                  </VStack>
                  <Badge
                    bg="$success100"
                    borderRadius="$full"
                    px="$2"
                    py="$1"
                    alignSelf="flex-start"
                  >
                    <BadgeIcon as={CheckCircleIcon} color="$success600" mr="$1" />
                    <BadgeText size={isSmallDevice ? '2xs' : 'xs'} color="$success700">
                      Active
                    </BadgeText>
                  </Badge>
                </HStack>
              </Box>
            </Animated.View>

            <Animated.View 
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideRightAnim }]
              }}
            >
              <Heading size={isSmallDevice ? 'sm' : 'md'} mb="$3" color="$textLight900">
                Summary
              </Heading>

              <HStack space="md" mb="$5" flexWrap="wrap">
                <Box
                  bg="$white"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$borderLight200"
                  p={isSmallDevice ? '$3' : '$4'}
                  flex={1}
                  minWidth={width > 500 ? width / 3 - 40 : width / 2 - 30}
                  style={styles.cardShadow}
                >
                  <HStack alignItems="center" mb="$2">
                    <Ionicons name="card" size={24} color="#216EAF" />
                    <Text ml="$2" color="$textLight500" size={isSmallDevice ? 'xs' : 'sm'}>
                      MIDs
                    </Text>
                  </HStack>
                  <Heading size={isSmallDevice ? 'lg' : 'xl'} color="$textLight900" mb="$1">
                    {summaryData.totalMIDs}
                  </Heading>
                  <Text size={isSmallDevice ? '2xs' : 'xs'} color="$success600">
                    {summaryData.activeMIDs} Active
                  </Text>
                </Box>

                <Box
                  bg="$white"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$borderLight200"
                  p={isSmallDevice ? '$3' : '$4'}
                  flex={1}
                  minWidth={width > 500 ? width / 3 - 40 : width / 2 - 30}
                  style={styles.cardShadow}
                >
                  <HStack alignItems="center" mb="$2">
                    <Ionicons name="hardware-chip" size={24} color="#216EAF" />
                    <Text ml="$2" color="$textLight500" size={isSmallDevice ? 'xs' : 'sm'}>
                      TIDs
                    </Text>
                  </HStack>
                  <Heading size={isSmallDevice ? 'lg' : 'xl'} color="$textLight900" mb="$1">
                    {summaryData.totalTIDs}
                  </Heading>
                  <Text size={isSmallDevice ? '2xs' : 'xs'} color="$success600">
                    {summaryData.activeTIDs} Active
                  </Text>
                </Box>

                <Box
                  bg="$white"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$borderLight200"
                  p={isSmallDevice ? '$3' : '$4'}
                  flex={1}
                  minWidth={width > 500 ? width / 3 - 40 : width / 2 - 30}
                  style={styles.cardShadow}
                >
                  <HStack alignItems="center" mb="$2">
                    <Ionicons name="swap-horizontal" size={24} color="#216EAF" />
                    <Text ml="$2" color="$textLight500" size={isSmallDevice ? 'xs' : 'sm'}>
                      Transactions
                    </Text>
                  </HStack>
                  <Heading size={isSmallDevice ? 'lg' : 'xl'} color="$textLight900" mb="$1">
                    {summaryData.recentTransactions}
                  </Heading>
                  <Text size={isSmallDevice ? '2xs' : 'xs'} color="$success600">
                    {summaryData.successRate}% Success
                  </Text>
                </Box>
              </HStack>
            </Animated.View>

            <Animated.View 
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideLeftAnim }]
              }}
            >
              <HStack justifyContent="space-between" alignItems="center" mb="$3">
                <Heading size={isSmallDevice ? 'sm' : 'md'} color="$textLight900">
                  Merchant IDs
                </Heading>
                <Pressable onPress={handleViewAllMIDs}>
                  <HStack alignItems="center" space="xs">
                    <Text color="$primary600" fontWeight="$medium" size={isSmallDevice ? 'xs' : 'sm'}>
                      View All
                    </Text>
                    <ArrowRightIcon size="xs" color="$primary600" />
                  </HStack>
                </Pressable>
              </HStack>

              <VStack
                space="md"
                bg="$white"
                borderRadius="$lg"
                borderWidth={1}
                borderColor="$borderLight200"
                p={isSmallDevice ? '$3' : '$4'}
                mb="$4"
                style={styles.cardShadow}
              >
                {[
                  { id: 'MID12345', status: 'Active', type: 'E-commerce' },
                  { id: 'MID67890', status: 'Active', type: 'Retail' },
                  { id: 'MID24680', status: 'Inactive', type: 'Mobile' },
                ].map((mid, index) => (
                  <React.Fragment key={mid.id}>
                    {index > 0 && <Divider />}
                    <Pressable
                      py="$2"
                      onPress={() => navigation.navigate('MIDDetails', { midId: mid.id })}
                    >
                      <HStack justifyContent="space-between" alignItems="center">
                        <VStack>
                          <Text
                            fontWeight="$medium"
                            color="$textLight900"
                            size={isSmallDevice ? 'sm' : 'md'}
                          >
                            {mid.id}
                          </Text>
                          <Text color="$textLight500" size={isSmallDevice ? 'xs' : 'sm'}>
                            {mid.type}
                          </Text>
                        </VStack>
                        <Badge
                          bg={mid.status === 'Active' ? '$success100' : '$error100'}
                          borderRadius="$full"
                          px="$2"
                          py="$1"
                        >
                          <BadgeText
                            color={mid.status === 'Active' ? '$success700' : '$error700'}
                            size={isSmallDevice ? '2xs' : 'xs'}
                          >
                            {mid.status}
                          </BadgeText>
                        </Badge>
                      </HStack>
                    </Pressable>
                  </React.Fragment>
                ))}
              </VStack>
            </Animated.View>

            <Animated.View 
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideRightAnim }]
              }}
            >
              <Button
                size={isSmallDevice ? 'sm' : 'md'}
                variant="outline"
                borderColor="$primary400"
                onPress={handleViewAllMIDs}
                mb="$6"
              >
                <View style={{ marginRight: 8 }}>
                  <Ionicons name="card-outline" size={18} color="#216EAF" />
                </View>
                <ButtonText color="$primary600">View All Merchant IDs</ButtonText>
              </Button>
            </Animated.View>
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  }
});

export default DashboardScreen; 