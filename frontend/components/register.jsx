import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { auth, db } from '../firebase-config'; // Import necessary Firebase modules
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore'; // Import Firestore methods
import { launchImageLibrary } from 'react-native-image-picker';
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
  const [menuItems, setMenuItems] = useState([]);
  const [images, setImages] = useState([]);

  // Function to handle user registration
  const handleUserRegistration = async () => {
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
  };

  // Function to handle business registration
  const handleBusinessRegistration = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    try {
      // Create user for business authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const businessId = userCredential.user.uid; // Get the UID of the authenticated business user

      // Save business details to Firestore directly in the 'businesses' collection
      await addDoc(collection(db, 'businesses'), {
        business_id: businessId, // Use the UID as the business ID
        business_name: businessName,
        business_type: businessType,
        description,
        location,
      });

      Alert.alert('Business Registered', 'Your business has been added!');
      navigation.navigate('Home'); // Redirect to home after registration
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to handle location picking
  const pickLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(`${location.coords.latitude}, ${location.coords.longitude}`);  // Set location as a string (latitude, longitude)
  };

  // Function to allow image selection
  // const selectImage = () => {
  //   launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
  //     if (response.assets) {
  //       setImages(response.assets.map(asset => asset.uri));  // Save the image URIs
  //     }
  //   });
  // };

  return (
    <ScrollView style={styles.container}>
      {!selectedRole && (
        <View>
          <TouchableOpacity style={styles.button} onPress={() => setSelectedRole('user')}>
            <Text style={styles.buttonText}>Register as User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setSelectedRole('business')}>
            <Text style={styles.buttonText}>Register as Business</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedRole === 'user' && (
        <View>
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
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedRole === 'business' && (
        <View>
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

          {/* <TextInput
            style={styles.input}
            placeholder="Menu Items (comma separated)"
            value={menuItems.join(', ')}
            onChangeText={(text) => setMenuItems(text.split(',').map(item => item.trim()))}
          />

          <TouchableOpacity style={styles.button} onPress={selectImage}>
            <Text style={styles.buttonText}>Select Images</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.button} onPress={handleBusinessRegistration}>
            <Text style={styles.buttonText}>Register Business</Text>
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
    backgroundColor: '#f4f4f9',
  },
  input: {
    width: '40%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
 

  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    width: '40%',
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
    color: '#838383',
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50',
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RegisterScreen;
