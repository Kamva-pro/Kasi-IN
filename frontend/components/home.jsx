import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../firebase-config'; 
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps'; // Import MapView
import * as Location from 'expo-location'; // Import Location API

const HomePage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState(null); // To store the user's location
  const [loadingLocation, setLoadingLocation] = useState(true); // New state to track location loading
  const navigation = useNavigation();

  // Fetch businesses from Firestore
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

  // Fetch current location for the map
  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoadingLocation(false); // Set loadingLocation to false if permission is denied
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLoadingLocation(false); // Stop loading after location is fetched
    };

    getCurrentLocation();
  }, []);

  // Filter businesses based on the search query
  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to business profile
  const handleCardPress = (business) => {
    navigation.navigate('Profile', { businessId: business.id });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search businesses"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Show Map if there's no search query, else show ScrollView */}
      {searchQuery.length === 0 ? (
        loadingLocation ? (
          <Text style={styles.loadingText}>Loading map...</Text>
        ) : (
          region && (
            <MapView
              style={styles.map}
              region={region}
              showsUserLocation={true}
              onRegionChangeComplete={setRegion}
            >
              {businesses.map((business) => (
                <Marker
                  key={business.id}
                  coordinate={{ latitude: business.latitude, longitude: business.longitude }}
                  title={business.name}
                  description={business.description}
                />
              ))}
            </MapView>
          )
        )
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <TouchableOpacity
                key={business.id}
                style={styles.card}
                onPress={() => handleCardPress(business)}
              >
                <Text style={styles.cardTitle}>{business.name}</Text>
                <Text style={styles.cardSubtitle}>{business.type}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResultsText}>No results found</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default HomePage;
