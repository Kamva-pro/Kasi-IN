import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { auth, db } from '../firebase-config'; // Import necessary Firebase modules
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore'; // Import Firestore methods
import * as Location from 'expo-location';

const RegisterScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle user registration
  const handleUserRegistration = async () => {

    setLoading(true);
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Save user to Firestore
      await addDoc(collection(db, 'users'), {
        userId,
        name,
        email,
      });

      Alert.alert('Registration Successful', 'Welcome!');
      navigation.navigate('Home'); // Redirect to home after registration
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    finally{
      setLoading(false);
    }
  };

  // Handle business registration
  const handleBusinessRegistration = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const businessId = userCredential.user.uid;

      // Save business details to Firestore
      await addDoc(collection(db, 'businesses'), {
        business_id: businessId,
        business_name: businessName,
        business_type: businessType,
        description,
        location,
      });

      Alert.alert('Business Registered', 'Your business has been added!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    finally{
      setLoading(false);
    }
  };

  const pickLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(`${location.coords.latitude}, ${location.coords.longitude}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Role Selection */}
      {!selectedRole && (
        <View style={styles.roleSelectionContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setSelectedRole('user')}>
            <Text style={styles.buttonText}>Register as User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setSelectedRole('business')}>
            <Text style={styles.buttonText}>Register as Business</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* User Registration Form */}
      {selectedRole === 'user' && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleUserRegistration}>
          <Text style={styles.buttonText}>{loading ? 'Creating User...' : 'Register'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Business Registration Form */}
      {selectedRole === 'business' && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Business Name"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Business Type"
            value={businessType}
            onChangeText={setBusinessType}
          />
          <TouchableOpacity style={styles.button} onPress={pickLocation}>
            <Text style={styles.buttonText}>Pick Location</Text>
          </TouchableOpacity>
          <Text>{location ? `Location: ${location}` : 'No location selected'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.button} onPress={handleBusinessRegistration}>
          <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register Business'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',  
  },
  roleSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000', 
    paddingVertical: 15,
    width: '80%',
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 15,
    color: '#000', 
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
