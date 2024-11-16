import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

// Define the initial region
const INITIAL_REGION = {
	latitude: 63.421615,
	longitude: 10.395053,
	latitudeDelta: 0.04,
	longitudeDelta: 0.05,
};

export default function MapWithMarkers({ markersArray }) {
	const navigationHook = useNavigation();
	const [userLocation, setUserLocation] = useState(null);
	const [mapRegion, setMapRegion] = useState(null); // Initially null to avoid rendering issues

	useEffect(() => {
		let locationSubscription = null;

		const fetchUserLocation = async () => {
			// Request permissions
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission Denied', 'Location permission is required.');
				setMapRegion(INITIAL_REGION); // Default to initial region if permission is denied
				return;
			}

			// Fetch current position and start watching the location
			let location = await Location.getCurrentPositionAsync({});
			const userCoords = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.05, // Slightly more zoomed out
				longitudeDelta: 0.05, // Slightly more zoomed out
			};

			// Check if the user is within 15 km of the initial region
			const distanceFromInitial = calculateDistance(
				INITIAL_REGION.latitude,
				INITIAL_REGION.longitude,
				userCoords.latitude,
				userCoords.longitude
			);

			// Set the map region based on user's location or initial region
			if (distanceFromInitial <= 15) {
				setMapRegion(userCoords);
			} else {
				setMapRegion(INITIAL_REGION);
			}

			setUserLocation(userCoords); // Set user's location for rendering

			// Start watching location changes
			locationSubscription = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.High,
					timeInterval: 1000,
					distanceInterval: 10,
				},
				(newLocation) => {
					const updatedCoords = {
						latitude: newLocation.coords.latitude,
						longitude: newLocation.coords.longitude,
						latitudeDelta: 0.05, // Slightly more zoomed out
						longitudeDelta: 0.05, // Slightly more zoomed out
					};

					setUserLocation(updatedCoords);
					setMapRegion(updatedCoords); // Update map region dynamically
				}
			);
		};

		fetchUserLocation();

		// Cleanup subscription on component unmount
		return () => {
			if (locationSubscription) {
				locationSubscription.remove();
			}
		};
	}, []);

	// Calculate distance in kilometers between two coordinates
	const calculateDistance = (lat1, lon1, lat2, lon2) => {
		const toRadians = (degree) => (degree * Math.PI) / 180;
		const R = 6371; // Radius of Earth in kilometers
		const dLat = toRadians(lat2 - lat1);
		const dLon = toRadians(lon2 - lon1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRadians(lat1)) *
				Math.cos(toRadians(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in kilometers
	};

	return (
		<MapView
			style={styles.mapStyle}
			initialRegion={INITIAL_REGION}
			region={mapRegion || INITIAL_REGION} // Default to initial region until mapRegion is set
		>
			{/* Render user's location marker */}
			{userLocation && (
				<Marker
					coordinate={userLocation}
					title='Your Location'
					description='This is where you are.'
				>
					<FontAwesome name='user-circle-o' size={30} color='#116bff' />
				</Marker>
			)}

			{/* Render markers from markersArray */}
			{markersArray.map((m, i) => (
				<Marker
					coordinate={m.latLong}
					title={m.title}
					description={m.shortDescription + ' - ' + m.pressForMoreInfo}
					key={`marker-${i}`}
					// Navigate to new page with details
					onCalloutPress={() =>
						navigationHook.navigate('MarkerInfoScreen', {
							itemId: m.key,
							itemTitle: m.title,
							itemPicture: m.logo,
							itemInformation: m.information,
							itemPhotographer: m.photographer,
						})
					}
				>
					<Image
						style={styles.image}
						source={require('../assets/ExploreTrondheim/map-marker.png')}
					/>
				</Marker>
			))}
		</MapView>
	);
}

const styles = StyleSheet.create({
	mapStyle: {
		width: width,
		height: height,
	},
	image: {
		resizeMode: 'contain',
		width: width * 0.1,
		height: width * 0.1,
	},
});
