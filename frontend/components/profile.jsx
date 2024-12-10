import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../firebase-config'; // Use your firebase-config.js file

const BusinessProfile = ({ route }) => {
  const { businessId } = route.params;
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      const docRef = doc(db, 'businesses', businessId); // Use db from firebase-config
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusiness(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchBusiness();
  }, [businessId]);

  if (!business) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{business.business_name}</Text>
      <Text style={styles.text}>Type: {business.business_type}</Text>
      <Text style={styles.text}>Email: {business.email}</Text>
      <Text style={styles.text}>Description: {business.description}</Text>
      <Text style={styles.text}>Location: {business.location}</Text>
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
