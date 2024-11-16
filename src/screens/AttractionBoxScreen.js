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

const filters = [
	{
		key: 'All',
		label: 'All places',
		backgroundColor: '#56BC72',
		borderColor: '#37894E',
	},
	{
		key: 'Favorites',
		label: 'Favorites',
		backgroundColor: '#8A2BE2', // Unique purple
		borderColor: '#5A189A',
	},
	{
		key: 'Trondheim',
		label: 'Trondheim 101',
		backgroundColor: '#7CD1ED',
		borderColor: '#0197CC',
	},
	{
		key: 'Help',
		label: 'Help',
		backgroundColor: '#FF4C4C', // Strong red for "Help"
		borderColor: '#A70000',
	},
	{
		key: 'Cafes',
		label: 'Cafés to relax in',
		backgroundColor: '#D2691E', // Brown-orange
		borderColor: '#A0522D',
	},
	{
		key: 'Eat',
		label: 'Places to eat',
		backgroundColor: '#FFA500', // Bright orange
		borderColor: '#CC8400',
	},
	{
		key: 'Drink',
		label: 'Places to drink',
		backgroundColor: '#FFD700', // Golden yellow
		borderColor: '#CCAC00',
	},
	{
		key: 'FreshAir',
		label: 'Fresh air',
		backgroundColor: '#87CEEB', // Light blue
		borderColor: '#4682B4',
	},
	{
		key: 'Activities',
		label: 'Activity for the body and soul',
		backgroundColor: '#32CD32', // Lime green
		borderColor: '#228B22',
	},
	{
		key: 'Shopping',
		label: 'Boutiques & Vintage shopping',
		backgroundColor: '#FF69B4', // Hot pink
		borderColor: '#C71585',
	},
	{
		key: 'Museums',
		label: 'Museums',
		backgroundColor: '#9370DB', // Medium purple
		borderColor: '#6A5ACD',
	},
	{
		key: 'Party',
		label: 'Party places',
		backgroundColor: '#FF6347', // Tomato red
		borderColor: '#FF4500',
	},
];

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
				<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
					{filters.map((filter) => (
						<TouchableOpacity
							key={filter.key}
							style={[
								styles.button, // Base button styles
								{
									backgroundColor: filter.backgroundColor,
									borderColor: filter.borderColor,
								},
							]}
							onPress={() => onFilterChange(filter.key)}
						>
							<Text>{filter.label}</Text>
						</TouchableOpacity>
					))}
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
	button: {
		alignSelf: 'flex-start',
		elevation: 4,
		borderRadius: 18,
		marginHorizontal: 2,
		borderWidth: 2,
		paddingVertical: 11,
		paddingHorizontal: 15,
	},
});
