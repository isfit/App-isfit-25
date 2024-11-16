import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // Using @expo/vector-icons
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Using FontAwesomeIcon
import {
	faUtensils,
	faCoffee,
	faHiking,
	faLandmark,
	faHeart,
	faBasketShopping,
	faWineGlass,
	faGlassCheers,
	faMonument,
	faPersonBiking,
	faLocationDot,
} from '@fortawesome/free-solid-svg-icons'; // Import desired icons

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

// Define the initial region
const INITIAL_REGION = {
	latitude: 63.421615,
	longitude: 10.395053,
	latitudeDelta: 0.04,
	longitudeDelta: 0.05,
};

// Map filterKey to corresponding icons
const getIconForFilter = (filterKey) => {
	switch (filterKey) {
		case 'Trondheim':
			return <FontAwesomeIcon icon={faMonument} size={30} color='#7CD1ED' />;
		case 'Help':
			return <FontAwesomeIcon icon={faHeart} size={30} color='#FF4C4C' />; // Red for Help
		case 'Cafes':
			return <FontAwesomeIcon icon={faCoffee} size={30} color='#D2691E' />;
		case 'Eat':
			return <FontAwesomeIcon icon={faUtensils} size={30} color='#FFA500' />;
		case 'Drink':
			return <FontAwesomeIcon icon={faWineGlass} size={30} color='#FFD700' />;
		case 'FreshAir':
			return <FontAwesomeIcon icon={faHiking} size={30} color='#87CEEB' />;
		case 'Activities':
			return (
				<FontAwesomeIcon icon={faPersonBiking} size={30} color='#32CD32' />
			);
		case 'Shopping':
			return (
				<FontAwesomeIcon icon={faBasketShopping} size={30} color='#FF69B4' />
			);
		case 'Museums':
			return <FontAwesomeIcon icon={faLandmark} size={30} color='#9370DB' />;
		case 'Party':
			return <FontAwesomeIcon icon={faGlassCheers} size={30} color='#FF6347' />;
		case 'All':
			return <FontAwesomeIcon icon={faMonument} size={30} color='#56BC72' />;
		default:
			return <FontAwesomeIcon icon={faLocationDot} size={30} color='#FF6D8A' />;
	}
};

export default function MapWithMarkers({ markersArray }) {
	const navigationHook = useNavigation();
	const [userLocation, setUserLocation] = useState(null);
	const [mapRegion, setMapRegion] = useState(null);

	useEffect(() => {
		let locationSubscription = null;

		const fetchUserLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setMapRegion(INITIAL_REGION);
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			const userCoords = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.05,
				longitudeDelta: 0.05,
			};

			setMapRegion(userCoords);
			setUserLocation(userCoords);

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
						latitudeDelta: 0.05,
						longitudeDelta: 0.05,
					};
					setUserLocation(updatedCoords);
					setMapRegion(updatedCoords);
				}
			);
		};

		fetchUserLocation();

		return () => {
			if (locationSubscription) {
				locationSubscription.remove();
			}
		};
	}, []);

	return (
		<MapView
			style={styles.mapStyle}
			initialRegion={INITIAL_REGION}
			region={mapRegion || INITIAL_REGION}
		>
			{/* Render user's location marker */}
			{userLocation && (
				<Marker
					coordinate={userLocation}
					title='Your Location'
					description='This is where you are.'
				>
					<FontAwesome name='map-marker' size={30} color='#116bff' />
				</Marker>
			)}

			{/* Render markers from markersArray */}
			{markersArray.map((m, i) => (
				<Marker
					coordinate={m.latLong}
					title={m.title}
					description={m.shortDescription}
					key={`marker-${i}`}
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
					{getIconForFilter(m.filterKey)}
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
});
