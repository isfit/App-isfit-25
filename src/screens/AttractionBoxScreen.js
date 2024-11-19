import React, { useEffect, useRef, useState } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { attractionMarkers } from '../assets/attractionMarkers';
import AttractionMarkerBox from '../components/AttractionMarkerBox';

import { filters, getStoredFavorites } from '../utils/ExploreUtils';

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
