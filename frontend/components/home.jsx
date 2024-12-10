import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import businesses from '../businesses'; // Import businesses data
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Hardcoded coordinates for Orlando West, Soweto (lat, long)
  const sowetoRegion = {
    latitude: -26.2283,
    longitude: 27.8981,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Adjust business locations to add distance between markers
  const adjustedBusinesses = filteredBusinesses.map(business => {
    const [lat, lon] = business.location.split(',').map(coord => parseFloat(coord));

    // Add small offsets to the business coordinates to space them out
    const adjustedLat = lat + (Math.random() * 0.005 - 0.0025);  // Random offset between -0.0025 and +0.0025
    const adjustedLon = lon + (Math.random() * 0.005 - 0.0025);  // Random offset between -0.0025 and +0.0025

    return {
      ...business,
      location: `${adjustedLat},${adjustedLon}`,
    };
  });

  const handleCardPress = (business) => {
    const source = business.firestore ? 'firestore' : 'local'; // Determine source
    navigation.navigate('Profile', { businessId: business.id, source });
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search businesses"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Conditional rendering: If there’s a search query, show the search results, otherwise show the map */}
      {searchQuery.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredBusinesses.map(business => (
            <TouchableOpacity key={business.id} onPress={() => handleCardPress(business)}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{business.name}</Text>
                <Text style={styles.cardType}>{business.type}</Text>
                <Text style={styles.cardDescription}>{business.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        // MapView with hardcoded region for Soweto
        <MapView
          style={styles.map}
          initialRegion={sowetoRegion}
          showsUserLocation={true}
        >
          {adjustedBusinesses.map(business => {
            const [latitude, longitude] = business.location.split(',').map(coord => parseFloat(coord));
            return (
              <Marker
                key={business.id}
                coordinate={{
                  latitude,
                  longitude,
                }}
                title={business.name}
                description={business.type}
              />
            );
          })}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardType: {
    fontSize: 14,
    color: '#555',
  },
  cardDescription: {
    fontSize: 12,
    color: '#888',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default HomePage;
