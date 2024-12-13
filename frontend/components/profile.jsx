import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase-config'; 
import CheckBox from 'react-native-check-box';

import businesses from '../businesses'; 

const BusinessProfile = ({ route }) => {
  const { businessId, source } = route.params; 
  const [business, setBusiness] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  const coverImages = [
    require('../assets/img-1.jpg'),
    require('../assets/img-2.jpg'),
    require('../assets/img-3.jpg'),
  ];

  const randomImage = coverImages[Math.floor(Math.random() * coverImages.length)];

  useEffect(() => {
    const fetchBusiness = async () => {
      if (source === 'firestore') {
        const docRef = doc(db, 'businesses', businessId); 
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBusiness(docSnap.data());
        } else {
          console.log('No such document in Firestore!');
        }
      } else if (source === 'local') {
        const localBusiness = businesses.find(b => b.id === businessId); 
        if (localBusiness) {
          setBusiness(localBusiness);
        } else {
          console.log('No such document in local data!');
        }
      }
    };

    fetchBusiness();
  }, [businessId, source]);

  const handlePlaceOrder = () => {
    // Check if any items are selected
    const selectedItemsList = Object.values(selectedItems).filter(Boolean);
    if (selectedItemsList.length === 0) {
      Alert.alert("No items selected", "Please select at least one item to place an order.");
    } else {
      setIsModalVisible(false);
      Alert.alert("Order Placed", "Your order has been successfully placed!");
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems(prevSelectedItems => ({
      ...prevSelectedItems,
      [item]: !prevSelectedItems[item],
    }));
  };

  if (!business) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollableContent}>
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
              {business.address || 'Address not available'}
            </Text>
          </View>

          {/* Menu (if available) */}
          {business.menu && (
            <View style={styles.menuContainer}>
              <Text style={styles.sectionTitle}>Menu</Text>
              {business.menu.map((item, index) => (
                <View key={index} style={styles.menuItem}>
                  <Text style={styles.menuItemTitle}>{item.item}</Text>
                  <Text style={styles.menuItemPrice}>{item.price}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Opening Hours */}
          <View style={styles.hoursContainer}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            <Text style={styles.hoursText}>{business.openingHours}</Text>
          </View>

          {/* Contact */}
          <View style={styles.contactContainer}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.contactText}>{business.contact}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.orderButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>

      {/* Modal for menu items */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Items</Text>

            {business.menu && business.menu.map((item, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <CheckBox
                  isChecked={selectedItems[item.item] || false}
                  onClick={() => handleCheckboxChange(item.item)}
                />
                <Text style={styles.checkboxLabel}>{item.item}</Text>
              </View>
            ))}

            {/* Place Order Button inside Modal */}
            <TouchableOpacity style={styles.placeOrderModalButton} onPress={handlePlaceOrder}>
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollableContent: {
    paddingBottom: 20, // Adjust padding for scrolling content
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
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    marginBottom: 10,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#777',
  },
  hoursContainer: {
    marginTop: 20,
  },
  hoursText: {
    fontSize: 16,
    color: '#555',
  },
  contactContainer: {
    marginTop: 20,
  },
  contactText: {
    fontSize: 16,
    color: '#555',
  },
  orderButton: {
    backgroundColor: '#000', // Black color for the button
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 25, // Rounded corners
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  placeOrderModalButton: {
    backgroundColor: '#000', // Black color for the button
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    borderRadius: 25, // Rounded corners
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#f44336',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    borderRadius: 25, // Rounded corners
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
});


export default BusinessProfile;
