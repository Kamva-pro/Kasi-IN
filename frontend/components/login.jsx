// components/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase-config';
// import * as Font from 'expo-font';
import { AppLoading } from 'expo'; // To handle loading font asynchronously

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  // // Load custom fonts asynchronously
  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  //       'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  //     });
  //     setFontLoaded(true);
  //   };

  //   loadFonts();
  // }, []);

  // Check if the user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // If the user is logged in, navigate to Home screen
        navigation.replace('Home');
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful', 'Welcome!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Wait for fonts to be loaded
  // if (!fontLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#888"  // Light placeholder color
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"  // Light placeholder color
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',  // Plain white background
    padding: 20,
  },
  header: {
    // fontFamily: 'Roboto-Bold', // Use the loaded Google font here
    fontSize: 24,  // Bigger font size for the header
    fontWeight: 'bold',  // Bold for prominence
    color: '#000',  // Black color for the header text
    marginBottom: 40,  // Spacing between header and form
  },
  input: {
    width: '80%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',  // Light grey border
    borderRadius: 25,  // Rounded edges
    fontSize: 16,
    backgroundColor: '#fff',  // White input fields
    // fontFamily: 'Roboto-Regular', // Regular font style
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000',  // Black button for high contrast
    paddingVertical: 15,
    width: '80%',
    borderRadius: 25,  // Rounded edges
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',  // White text on dark button
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 15,
    color: '#000',  // Dark text for the link
    fontSize: 16,
    textDecorationLine: 'underline',  // Simple underline for clarity
  },
});

export default LoginScreen;
