import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../firebase-config'; // Use your firebase-config.js file
import businesses from '../businesses'; // Import the local businesses array

const BusinessProfile = ({ route }) => {
  const { businessId, source } = route.params; // Add source parameter
  const [business, setBusiness] = useState(null);

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

  if (!business) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{business.name || business.business_name}</Text>
      <Text style={styles.text}>Type: {business.type || business.business_type}</Text>
      <Text style={styles.text}>
        Description: {business.description || 'No description available'}
      </Text>
      <Text style={styles.text}>
        Location: {business.location || 'No location available'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default BusinessProfile;
