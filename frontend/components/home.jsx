// import React from 'react';
// import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import { getAuth, signOut } from 'firebase/auth';
// import { useNavigation } from '@react-navigation/native'; // For navigation

// const HomePage = () => {
//   const navigation = useNavigation(); // Access navigation

//   // Logout function
//   const handleLogout = async () => {
//     try {
//       await signOut(getAuth());
//       navigation.replace('Login'); // Navigate to login screen after logout
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while logging out.');
//     }
//   };

//   return (
//     <View>
//       <TouchableOpacity onPress={handleLogout}>
//         <Text>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default HomePage;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebase-config';  // Adjust path for firebase-config
import { collection, getDocs } from 'firebase/firestore';

const HomePage = () => {
  const [businessLocations, setBusinessLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch businesses from Firestore
    const fetchBusinessLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'businesses'));
        const locations = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.business_name,
            description: data.description,
            latitude: data.location_coords.latitude,
            longitude: data.location_coords.longitude,
          };
        });
        setBusinessLocations(locations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching locations: ', error);
        setLoading(false);
      }
    };

    fetchBusinessLocations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (Platform.OS !== 'web') {
    MapView = require('react-native-maps').default;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.7749,  // Default latitude (center of the map)
          longitude: -122.4194,  // Default longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {businessLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePage;

