import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Divider,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Card,
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  CloseIcon,
  Switch,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp } from '../navigation/types';

type Props = {
  navigation: NavigationProp<'Main'>;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  // Edit profile form state
  const [formData, setFormData] = useState({
    merchantName: user?.merchantName || '',
    email: user?.email || '',
    phone: '+971 50 123 4567', // Example placeholder
    address: 'Dubai, UAE', // Example placeholder
  });
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: logout,
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would save to an API
    // For now, just close the modal
    setShowEditModal(false);
    
    // Show success message
    Alert.alert('Success', 'Profile updated successfully');
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Box flex={1} bg="$backgroundLight50" safeAreaTop>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Box bg="$white" p="$4" borderRadius="$lg" mb="$4">
          <VStack alignItems="center" space="md">
            <Avatar size="2xl" borderRadius="$full" bg="$primary500">
              <AvatarFallbackText>{user.merchantName}</AvatarFallbackText>
            </Avatar>
            <VStack alignItems="center">
              <Heading size="lg" color="$textDark900">
                {user.merchantName}
              </Heading>
              <Text color="$textLight600" fontSize="$md">
                {user.email}
              </Text>
              <Button 
                variant="outline" 
                mt="$3"
                onPress={() => setShowEditModal(true)}
                size="sm"
              >
                <ButtonText>Edit Profile</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Box>
        
        {/* Account Information */}
        <Card bg="$white" mb="$4" p="$4">
          <Heading size="sm" mb="$3" color="$textDark900">Account Information</Heading>
          <Divider mb="$3" />
          
          <VStack space="md">
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Account Type</Text>
              <Text color="$textDark900" fontWeight="$medium">Merchant</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Account Status</Text>
              <Text color="$success600" fontWeight="$medium">Active</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Account Created</Text>
              <Text color="$textDark900" fontWeight="$medium">March 15, 2024</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="$textLight600">Merchant IDs</Text>
              <Text color="$textDark900" fontWeight="$medium">{user.mids.length}</Text>
            </HStack>
          </VStack>
        </Card>
        
        {/* Settings */}
        <Card bg="$white" mb="$4" p="$4">
          <Heading size="sm" mb="$3" color="$textDark900">Settings</Heading>
          <Divider mb="$3" />
          
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="$textDark900">Push Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
                trackColor={{ false: '$gray300', true: '$primary300' }}
                thumbColor={notificationsEnabled ? '$primary500' : '$gray100'}
              />
            </HStack>
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="$textDark900">Biometric Login</Text>
              <Switch
                value={biometricEnabled}
                onToggle={() => setBiometricEnabled(!biometricEnabled)}
                trackColor={{ false: '$gray300', true: '$primary300' }}
                thumbColor={biometricEnabled ? '$primary500' : '$gray100'}
              />
            </HStack>
          </VStack>
        </Card>
        
        {/* Support */}
        <Card bg="$white" mb="$4" p="$4">
          <Heading size="sm" mb="$3" color="$textDark900">Support</Heading>
          <Divider mb="$3" />
          
          <VStack space="md">
            <Pressable>
              <Text color="$primary500" fontWeight="$medium">Contact Support</Text>
            </Pressable>
            <Pressable>
              <Text color="$primary500" fontWeight="$medium">FAQ</Text>
            </Pressable>
            <Pressable>
              <Text color="$primary500" fontWeight="$medium">Terms of Service</Text>
            </Pressable>
            <Pressable>
              <Text color="$primary500" fontWeight="$medium">Privacy Policy</Text>
            </Pressable>
          </VStack>
        </Card>
        
        {/* Logout Button */}
        <Button 
          action="secondary"
          variant="outline"
          onPress={handleLogout}
          mb="$4"
        >
          <ButtonText>Logout</ButtonText>
        </Button>
        
        {/* App Version */}
        <Text textAlign="center" color="$textLight500" fontSize="$xs">
          Version 1.0.0
        </Text>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Edit Profile</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} color="$textDark500" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Merchant Name</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.merchantName}
                    onChangeText={(value) => setFormData({...formData, merchantName: value})}
                  />
                </Input>
              </FormControl>
              
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Email</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.email}
                    onChangeText={(value) => setFormData({...formData, email: value})}
                  />
                </Input>
              </FormControl>
              
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Phone</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.phone}
                    onChangeText={(value) => setFormData({...formData, phone: value})}
                  />
                </Input>
              </FormControl>
              
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Address</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.address}
                    onChangeText={(value) => setFormData({...formData, address: value})}
                  />
                </Input>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              mr="$3"
              onPress={() => setShowEditModal(false)}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button onPress={handleSaveProfile}>
              <ButtonText>Save</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
});

export default ProfileScreen; 