import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // For navigation

const HomePage = () => {
  const navigation = useNavigation(); // Access navigation

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigation.replace('Login'); // Navigate to login screen after logout
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomePage;
