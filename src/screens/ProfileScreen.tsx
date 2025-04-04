import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Dimensions, Platform, View } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  ScrollView,
  Avatar,
  AvatarFallbackText,
  Divider,
  Button,
  ButtonText,
  Pressable,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: NavigationProp<'Main'>;
};

// Get dimensions for responsive UI
const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

// List of valid Ionicons names for type safety
type IconName = 
  | 'card-outline'
  | 'business-outline'
  | 'call-outline'
  | 'time-outline'
  | 'person-outline'
  | 'key-outline'
  | 'notifications-outline'
  | 'chevron-forward'
  | 'log-out-outline';

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(50))[0];
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Mock user data - would be replaced with real data
  const profileData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@shemeel.com',
    merchantId: user?.merchantId || 'MID12345678',
    role: 'Administrator',
    company: 'ABC Corp',
    lastLogin: new Date().toDateString(),
    phone: '+1 (555) 123-4567',
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box flex={1} bg="$backgroundLight50">
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header section with user info */}
          <Box 
            bg="$primary500" 
            p="$6" 
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              <VStack space="md" alignItems="center">
                <Avatar size="2xl" bg="$primary300" borderColor="$white" borderWidth={2}>
                  <AvatarFallbackText>{profileData.name}</AvatarFallbackText>
                </Avatar>
                <VStack alignItems="center">
                  <Heading color="$white" size="xl">
                    {profileData.name}
                  </Heading>
                  <Text color="$white:alpha.80" size="sm">
                    {profileData.email}
                  </Text>
                  <HStack space="sm" mt="$2" alignItems="center">
                    <View style={styles.badge}>
                      <Text color="$primary700" size="xs" fontWeight="$medium">
                        {profileData.role}
                      </Text>
                    </View>
                  </HStack>
                </VStack>
              </VStack>
            </Animated.View>
          </Box>

          {/* Profile details section */}
          <Animated.View
            style={[
              styles.detailsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            <Box
              bg="$white"
              p="$6"
              borderRadius="$xl"
              borderWidth={1}
              borderColor="$borderLight200"
              style={styles.cardShadow}
              mb="$4"
            >
              <Heading size="md" mb="$4" color="$textLight900">
                Merchant Information
              </Heading>
              <VStack space="md">
                <ProfileItem 
                  label="Merchant ID" 
                  value={profileData.merchantId} 
                  icon="card-outline"
                />
                <Divider />
                <ProfileItem 
                  label="Company" 
                  value={profileData.company} 
                  icon="business-outline"
                />
                <Divider />
                <ProfileItem 
                  label="Phone" 
                  value={profileData.phone} 
                  icon="call-outline"
                />
                <Divider />
                <ProfileItem 
                  label="Last Login" 
                  value={profileData.lastLogin} 
                  icon="time-outline"
                />
              </VStack>
            </Box>

            <Box
              bg="$white"
              p="$6"
              borderRadius="$xl"
              borderWidth={1}
              borderColor="$borderLight200"
              style={styles.cardShadow}
              mb="$4"
            >
              <Heading size="md" mb="$4" color="$textLight900">
                Account Settings
              </Heading>
              <VStack space="md">
                <Pressable py="$2" onPress={() => {}}>
                  <HStack alignItems="center" space="md">
                    <Ionicons name="person-outline" size={22} color="#216EAF" />
                    <Text fontWeight="$medium" color="$textLight900">
                      Edit Profile
                    </Text>
                    <Box flex={1} />
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </HStack>
                </Pressable>
                <Divider />
                <Pressable py="$2" onPress={() => {}}>
                  <HStack alignItems="center" space="md">
                    <Ionicons name="key-outline" size={22} color="#216EAF" />
                    <Text fontWeight="$medium" color="$textLight900">
                      Change Password
                    </Text>
                    <Box flex={1} />
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </HStack>
                </Pressable>
                <Divider />
                <Pressable py="$2" onPress={() => {}}>
                  <HStack alignItems="center" space="md">
                    <Ionicons name="notifications-outline" size={22} color="#216EAF" />
                    <Text fontWeight="$medium" color="$textLight900">
                      Notification Settings
                    </Text>
                    <Box flex={1} />
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </HStack>
                </Pressable>
              </VStack>
            </Box>

            <Button
              variant="outline"
              borderColor="$error400"
              mb="$8"
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <ButtonText color="$error600">Logout</ButtonText>
            </Button>
          </Animated.View>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

// Helper component to display profile items
const ProfileItem = ({ label, value, icon }: { label: string; value: string; icon: IconName }) => (
  <HStack alignItems="center" space="md">
    <Ionicons name={icon} size={22} color="#216EAF" />
    <VStack>
      <Text size="xs" color="$textLight500">
        {label}
      </Text>
      <Text fontWeight="$medium" color="$textLight900">
        {value}
      </Text>
    </VStack>
  </HStack>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
  },
  detailsContainer: {
    padding: 16,
    marginTop: -20,
  },
  badge: {
    backgroundColor: '#E6F0F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
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

export default ProfileScreen; 