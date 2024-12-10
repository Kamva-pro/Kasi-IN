// import React, { useEffect, useState } from "react";
// import { StyleSheet, View, PermissionsAndroid, Platform } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import firestore from "@react-native-firebase/firestore";
// import Geolocation from "@react-native-community/geolocation";

// const HomePage = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [region, setRegion] = useState({
//     latitude: 0, // Initial values; will be updated
//     longitude: 0,
//     latitudeDelta: 0.1,
//     longitudeDelta: 0.1,
//   });

//   // Fetch user's current location
//   useEffect(() => {
//     const getCurrentLocation = async () => {
//       if (Platform.OS === "android") {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.warn("Location permission not granted");
//           return;
//         }
//       }

//       Geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setRegion((prev) => ({
//             ...prev,
//             latitude,
//             longitude,
//           }));
//         },
//         (error) => console.error("Geolocation error:", error),
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     };

//     getCurrentLocation();
//   }, []);

//   // Fetch businesses from Firestore
//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection("businesses")
//       .onSnapshot((snapshot) => {
//         const data = snapshot.docs.map((doc) => {
//           const rawLocation = doc.data().location.split(",");
//           return {
//             id: doc.id,
//             name: doc.data().business_name,
//             type: doc.data().business_type,
//             description: doc.data().description,
//             latitude: parseFloat(rawLocation[0]),
//             longitude: parseFloat(rawLocation[1]),
//           };
//         });
//         setBusinesses(data);
//       });

//     return () => unsubscribe(); // Clean up listener on unmount
//   }, []);

//   return (
//     <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         region={region}
//         onRegionChangeComplete={setRegion}
//         showsUserLocation={true}
//         customMapStyle={mapStyle} // Optional: Add HERE-style customization
//         tileOverlay={{
//           urlTemplate:
//             "https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apikey=MvGYtGyL3kLYfa7gweyC_T7Z14zy0OXKBGtz1rPgmCk",
//           tileSize: 256,
//         }}
//       >
//         {businesses.map((business) => (
//           <Marker
//             key={business.id}
//             coordinate={{
//               latitude: business.latitude,
//               longitude: business.longitude,
//             }}
//             title={business.name}
//             description={business.description}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// const mapStyle = []; // Add HERE-style JSON for custom map style if needed.

// export default HomePage;


import React from "react";

const HomePage = () => {
    return (
        <h1>Home page</h1>
    )
}

export default HomePage;