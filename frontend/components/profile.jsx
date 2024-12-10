import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../firebase-config'; // Use your firebase-config.js file
import businesses from '../businesses'; // Import the local businesses array

const BusinessProfile = ({ route }) => {
  const { businessId, source } = route.params; // Add source parameter
  const [business, setBusiness] = useState(null);

  // Preload the abstract art images
  const coverImages = [
    require('../../assets/img-1.jpg'),
    require('../../assets/img-2.jpg'),
    require('../../assets/img-3.jpg'),
  ];

  // Select a random image
  const randomImage = coverImages[Math.floor(Math.random() * coverImages.length)];

  useEffect(() => {
    const fetchBusiness = async () => {
      if (source === 'firestore') {
        const docRef = doc(db, 'businesses', businessId); // Use Firestore
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBusiness(docSnap.data());
        } else {
          console.log('No such document in Firestore!');
        }
      } else if (source === 'local') {
        const localBusiness = businesses.find(b => b.id === businessId); // Find in local data
        if (localBusiness) {
          setBusiness(localBusiness);
        } else {
          console.log('No such document in local data!');
        }
      }
    };

    fetchBusiness();
  }, [businessId, source]);

  if (!business) return <Text style={styles.loadingText}>Loading...</Text>;

  // Format location for display
  const formatLocation = (location) => {
    if (!location) return 'Location not available';
    const [latitude, longitude] = location.split(',').map(coord => parseFloat(coord));
    return `Latitude: ${latitude.toFixed(5)}, Longitude: ${longitude.toFixed(5)}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cover Image */}
      <Image
        source={randomImage}
        style={styles.coverImage}
      />
      {/* Business Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{business.name || business.business_name}</Text>
        <Text style={styles.description}>
          {business.description || 'No description available'}
        </Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>
            {business.address || formatLocation(business.location)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  locationContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#555',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default BusinessProfile;
