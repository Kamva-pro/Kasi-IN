import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';


// Login Screen Component
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = () => {
      console.log('Logging in with:', email, password);
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button title="Login" onPress={handleLogin} color="#4CAF50" />
        
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  // Styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f4f4f9',
    },
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
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
    linkText: {
      marginTop: 20,
      color: '#007BFF',
      textDecorationLine: 'underline',
    },
  });
  

  export default LoginScreen