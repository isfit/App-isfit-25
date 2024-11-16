import React, { useEffect, useRef, useState } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import { attractionMarkers } from '../assets/attractionMarkers';
import AttractionMarkerBox from '../components/AttractionMarkerBox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultFilter = 'All'; // Default filter

export default function AttractionBoxScreen({ navigation }) {
	const scrollRef = useRef();

	const [state, setState] = useState({
		activeFilter: defaultFilter,
		activeMarkers: attractionMarkers, // Default to all attractions
		storedFavorites: [], // Initialize storedFavorites state
	});

	// Fetch favorites from AsyncStorage
	const updateFavorites = async () => {
		try {
			const storedFavorites = await getStoredFavorites();
			if (state.activeFilter === 'Favorites') {
				applyFavoriteFilter(storedFavorites); // Apply favorites filter
			} else {
				// Keep the current filter intact
				onFilterChange(state.activeFilter);
			}
		} catch (error) {
			console.error('Error updating favorites:', error);
		}
	};

	// Apply the favorites filter
	const applyFavoriteFilter = async (favorites) => {
		try {
			const storedFavorites = favorites || (await getStoredFavorites()); // Use passed or fetched favorites
			const filteredMarkersList = attractionMarkers.filter((marker) =>
				storedFavorites.includes(marker.key)
			);
			setState((prevState) => ({
				...prevState,
				activeFilter: 'Favorites',
				activeMarkers: filteredMarkersList,
			}));
		} catch (error) {
			console.error('Error applying favorite filter:', error);
		}
	};

	// Apply the "All" filter
	const applyAllFilter = () => {
		setState((prevState) => ({
			...prevState,
			activeFilter: 'All',
			activeMarkers: attractionMarkers,
		}));
	};

	const onFilterChange = (filter) => {
		if (filter === 'Favorites') {
			applyFavoriteFilter(); // Fetch and apply favorites
		} else if (filter === 'All') {
			applyAllFilter();
		} else {
			const filteredMarkersList = attractionMarkers.filter(
				(x) => x.filterKey === filter
			);
			setState((prevState) => ({
				...prevState,
				activeFilter: filter,
				activeMarkers: filteredMarkersList,
			}));
		}
	};

	// useEffect to add focus listener for navigation
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			scrollRef.current?.scrollTo({ y: 0, animated: true });
			updateFavorites(); // Update favorites on focus without overriding filters
		});

		return unsubscribe; // Cleanup listener on unmount
	}, [navigation, state.activeFilter]); // Add `state.activeFilter` as a dependency

	return (
		<View style={{ flex: 1 }}>
			<View style={{ backgroundColor: '#FFF', paddingVertical: 4 }}>
				<ScrollView horizontal={true}>
					<TouchableOpacity
						style={styles.greenFilterButton}
						onPress={() => onFilterChange('All')}
					>
						<Text>All places</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.purpleFilterButton}
						onPress={() => onFilterChange('Favorites')}
					>
						<Text>Favorites</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.blueFilterButton}
						onPress={() => onFilterChange('Trondheim')}
					>
						<Text>Trondheim 101</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.redFilterButton}
						onPress={() => onFilterChange('Help')}
					>
						<Text>Help</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.orangeFilterButton}
						onPress={() => onFilterChange('Cafes')}
					>
						<Text>Cafés to relax in</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.orangeFilterButton}
						onPress={() => onFilterChange('Eat')}
					>
						<Text>Places to eat</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.orangeFilterButton}
						onPress={() => onFilterChange('Drink')}
					>
						<Text>Places to drink</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.greenFilterButton}
						onPress={() => onFilterChange('FreshAir')}
					>
						<Text>Fresh air</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.greenFilterButton}
						onPress={() => onFilterChange('Activities')}
					>
						<Text>Activity for the body and soul</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.pinkFilterButton}
						onPress={() => onFilterChange('Shopping')}
					>
						<Text>Boutiques & Vintage shopping</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.purpleFilterButton}
						onPress={() => onFilterChange('Museums')}
					>
						<Text>Museums</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.yellowFilterButton}
						onPress={() => onFilterChange('Party')}
					>
						<Text>Party places</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
			<ScrollView ref={scrollRef}>
				{state.activeMarkers.map((m, i) => (
					<AttractionMarkerBox
						key={i}
						keyID={m.key}
						filterKey={m.filterKey}
						title={m.title}
						shortDescription={m.shortDescription}
						logo={m.logo}
						photographer={m.photographer}
						info={m.info}
						information={m.information}
						latLong={m.latLong}
					/>
				))}
			</ScrollView>
		</View>
	);
}

// Helper function to get stored favorites
const getStoredFavorites = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem('@ISFiTApp23_FavoriteMarkers');
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	} catch (e) {
		console.error('Error fetching favorites:', e);
		return [];
	}
};

const styles = StyleSheet.create({
	redFilterButton: {
		alignSelf: 'flex-start',
		elevation: 4,
		backgroundColor: '#FF7B7B',
		borderColor: '#A70000',
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
	blueFilterButton: {
		alignSelf: 'flex-start',
		elevation: 4,
		backgroundColor: '#7CD1ED',
		borderColor: '#0197CC',
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
	orangeFilterButton: {
		alignSelf: 'flex-start',
		elevation: 4,
		backgroundColor: '#FFAD33',
		borderColor: '#F78D1F',
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
	greenFilterButton: {
		alignSelf: 'flex-start',
		elevation: 4,
		backgroundColor: '#56BC72',
		borderColor: '#37894E',
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
	purpleFilterButton: {
		alignSelf: 'flex-start',
		elevation: 4,
		backgroundColor: '#B77FB9',
		borderColor: '#99499C',
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
	pinkFilterButton: {
		alignSelf: 'flex-start',
		elevation: 4,
		backgroundColor: '#F087AA',
		borderColor: '#E63872',
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
	yellowFilterButton: {
		alignSelf: 'flex-start',
		elevation: 4,
		backgroundColor: '#F0BD69',
		borderColor: '#EAA22A',
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
});
