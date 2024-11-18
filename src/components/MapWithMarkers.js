import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
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
	faCircleUser,
	faLocationArrow,
	faCity,
} from '@fortawesome/free-solid-svg-icons';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const INITIAL_REGION = {
	latitude: 63.421615,
	longitude: 10.395053,
	latitudeDelta: 0.04,
	longitudeDelta: 0.05,
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // Earth's radius in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in km
};

const getIconForFilter = (filterKey) => {
	switch (filterKey) {
		case 'Trondheim':
			return <FontAwesomeIcon icon={faMonument} size={30} color='#7CD1ED' />;
		case 'Help':
			return <FontAwesomeIcon icon={faHeart} size={30} color='#FF4C4C' />;
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
	const mapRegion = useRef(
		new AnimatedRegion({
			latitude: INITIAL_REGION.latitude,
			longitude: INITIAL_REGION.longitude,
			latitudeDelta: INITIAL_REGION.latitudeDelta,
			longitudeDelta: INITIAL_REGION.longitudeDelta,
		})
	).current;

	const mapViewRef = useRef(null);

	useEffect(() => {
		let locationSubscription = null;

		const fetchUserLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				mapRegion.setValue(INITIAL_REGION);
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			const userCoords = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.05,
				longitudeDelta: 0.05,
			};

			const distance = calculateDistance(
				userCoords.latitude,
				userCoords.longitude,
				INITIAL_REGION.latitude,
				INITIAL_REGION.longitude
			);

			if (distance <= 15) {
				mapRegion.setValue(userCoords);
				setUserLocation(userCoords);
			} else {
				mapRegion.setValue(INITIAL_REGION);
			}

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

					const newDistance = calculateDistance(
						updatedCoords.latitude,
						updatedCoords.longitude,
						INITIAL_REGION.latitude,
						INITIAL_REGION.longitude
					);

					if (newDistance <= 15) {
						setUserLocation(updatedCoords);
					}
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

	const recenterToUser = () => {
		if (userLocation && mapViewRef.current) {
			mapViewRef.current.animateToRegion(userLocation, 500);
		}
	};

	const recenterToInitial = () => {
		if (mapViewRef.current) {
			mapViewRef.current.animateToRegion(INITIAL_REGION, 500);
		}
	};

	return (
		<View style={styles.container}>
			<MapView.Animated
				ref={mapViewRef}
				style={styles.mapStyle}
				initialRegion={INITIAL_REGION}
			>
				{userLocation && (
					<Marker
						coordinate={userLocation}
						title='Your Location'
						description='This is where you are.'
					>
						<Animatable.View
							animation='pulse'
							easing='ease-out'
							iterationCount='infinite'
						>
							<FontAwesomeIcon icon={faCircleUser} size={30} color='#FF6D8A' />
						</Animatable.View>
					</Marker>
				)}

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
			</MapView.Animated>

			<View
				style={[
					styles.buttonContainer,
					userLocation ? null : styles.circleShape,
				]}
			>
				{userLocation && (
					<>
						<TouchableOpacity
							style={styles.iconButton}
							onPress={recenterToUser}
						>
							<FontAwesomeIcon
								icon={faLocationArrow}
								size={20}
								color='#FF6D8A'
							/>
						</TouchableOpacity>
						<View style={styles.divider} />
					</>
				)}

				<TouchableOpacity
					style={[styles.iconButton]}
					onPress={recenterToInitial}
				>
					<FontAwesomeIcon icon={faCity} size={20} color='#FF6D8A' />
				</TouchableOpacity>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mapStyle: {
		width: width,
		height: height,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 30,
		right: 10,
		backgroundColor: '#FFFFFF',
		borderRadius: 25,
		elevation: 5,
		padding: 5,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#FFFFFF', // Set the background color
		justifyContent: 'center', // Center the content horizontally
		alignItems: 'center', // Center the content vertically
		elevation: 5, // Add shadow (Android)
		shadowColor: '#000', // Add shadow (iOS)
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	iconButton: {
		padding: 15,
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: '#FF6D8A',
	},
	circleShape: {
		borderRadius: 50,
	},
});
