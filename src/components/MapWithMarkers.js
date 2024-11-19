import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { calculateDistance, getIconForFilter } from '../utils/ExploreUtils';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
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
