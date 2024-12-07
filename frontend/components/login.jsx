// components/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase-config'; 

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
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
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 20,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
