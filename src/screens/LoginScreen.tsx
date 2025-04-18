import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  InputField,
  InputIcon,
  InputSlot,
  Center,
  Spinner,
  Pressable,
  Icon,
} from '@gluestack-ui/themed';
import { useAuth } from '../hooks/useAuth';
import { NavigationProp } from '../navigation/types';
import { EyeIcon, EyeOffIcon, LockIcon, AtSymbolIcon } from '@gluestack-ui/themed';

type Props = {
  navigation: NavigationProp<'Login'>;
};

const LoginScreen: React.FC<Props> = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('merchant1@shemeel.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Box flex={1} bg="$white">
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }}
          style={styles.backgroundImage}
        >
          <Box
            flex={1}
            justifyContent="center"
            alignItems="center"
            bg="$backgroundLight950:alpha.70"
          >
            <Animated.View 
              style={[
                styles.animatedContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Box
                w="90%"
                maxWidth={400}
                bg="$white"
                borderRadius="$xl"
                p="$6"
                shadow="$md"
              >
                <VStack space="xl" alignItems="center">
                  <Center>
                    <Heading size="2xl" color="$primary500" fontWeight="$bold">
                      Shemeel
                    </Heading>
                    <Text color="$textLight500" fontSize="$sm" mt="$1">
                      Merchant Profile Portal
                    </Text>
                  </Center>

                  <VStack space="md" w="100%">
                    <FormControl isRequired>
                      <FormControl.Label>
                        <Text color="$textLight700" fontSize="$sm">
                          Email
                        </Text>
                      </FormControl.Label>
                      <Input>
                        <InputSlot pl="$3">
                          <InputIcon as={AtSymbolIcon} color="$primary400" />
                        </InputSlot>
                        <InputField
                          pl="$2"
                          placeholder="Enter your email"
                          autoCapitalize="none"
                          value={email}
                          onChangeText={setEmail}
                        />
                      </Input>
                    </FormControl>

                    <FormControl isRequired>
                      <FormControl.Label>
                        <Text color="$textLight700" fontSize="$sm">
                          Password
                        </Text>
                      </FormControl.Label>
                      <Input>
                        <InputSlot pl="$3">
                          <InputIcon as={LockIcon} color="$primary400" />
                        </InputSlot>
                        <InputField
                          pl="$2"
                          placeholder="Enter your password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChangeText={setPassword}
                        />
                        <InputSlot pr="$3" onPress={toggleShowPassword}>
                          <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} color="$textLight400" />
                        </InputSlot>
                      </Input>
                    </FormControl>

                    {error ? (
                      <Text color="$error600" fontSize="$sm">
                        {error}
                      </Text>
                    ) : null}

                    <Button
                      size="md"
                      mt="$2"
                      bg="$primary500"
                      onPress={handleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner color="$white" size="small" />
                      ) : (
                        <Text color="$white" fontWeight="$medium">
                          Login
                        </Text>
                      )}
                    </Button>

                    <Pressable mt="$2">
                      <Text
                        color="$primary500"
                        fontSize="$sm"
                        textAlign="center"
                        fontWeight="$medium"
                      >
                        Forgot Password?
                      </Text>
                    </Pressable>
                  </VStack>
                </VStack>
              </Box>
            </Animated.View>
          </Box>
        </ImageBackground>
      </Box>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default LoginScreen; 