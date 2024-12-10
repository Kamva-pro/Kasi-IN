import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../firebase-config'; 
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [region, setRegion] = useState({
    latitude: -26.1441, // Latitude for 132 Jan Smuts Avenue
    longitude: 28.0341, // Longitude for 132 Jan Smuts Avenue
    latitudeDelta: 0.005, // Smaller delta for zoomed-in view
    longitudeDelta: 0.005, // Smaller delta for zoomed-in view
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'businesses'));
        const data = querySnapshot.docs
          .map((doc) => {
            const locationString = doc.data().location;
            if (!locationString) {
              console.warn(`Missing location for business ID: ${doc.id}`);
              return null;
            }

            const [latitude, longitude] = locationString
              .split(',')
              .map((coord) => parseFloat(coord));

            return {
              id: doc.id,
              name: doc.data().business_name || 'Unknown Business',
              type: doc.data().business_type || 'Unknown Type',
              description: doc.data().description || 'No description provided',
              latitude,
              longitude,
            };
          })
          .filter((business) => business !== null);

        setBusinesses(data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkerPress = (business) => {
    navigation.navigate('BusinessProfile', { businessId: business.id });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search businesses"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <MapView
        style={styles.map}
        region={region} // Use the hard-coded region
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={setRegion} // Update region on user interaction
      >
        {filteredBusinesses.map((business) => (
          <Marker
            key={business.id}
            coordinate={{
              latitude: business.latitude,
              longitude: business.longitude,
            }}
            title={business.name}
            description={business.description}
            onPress={() => handleMarkerPress(business)}
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
    flex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default HomePage;
