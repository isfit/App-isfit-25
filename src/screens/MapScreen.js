import React, { useContext, useEffect, useState } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { attractionMarkers } from '../assets/attractionMarkers';
import MapWithMarkers from '../components/MapWithMarkers';
import { filters } from '../utils/ExploreUtils';
import { FilterContext } from '../context/FilterContext';

export default function MapScreen({ navigation }) {
	const { activeFilter, changeFilter, favorites } = useContext(FilterContext);
	const [activeMarkers, setActiveMarkers] = useState([]);

	useEffect(() => {
		const applyFilter = () => {
			let filteredMarkersList = [];

			if (activeFilter === 'Favorites') {
				filteredMarkersList = attractionMarkers.filter((x) =>
					favorites.includes(x.key)
				);
			} else if (activeFilter === 'All') {
				filteredMarkersList = attractionMarkers;
			} else {
				filteredMarkersList = attractionMarkers.filter(
					(x) => x.filterKey === activeFilter
				);
			}

			setActiveMarkers(filteredMarkersList);
		};

		applyFilter();
	}, [activeFilter, favorites]);

	return (
		<View style={{ flex: 1 }}>
			{/* Map section */}
			<View style={{ flex: 1 }}>
				<MapWithMarkers markersArray={activeMarkers} />
			</View>

			{/* Filter Buttons Section */}
			<View style={styles.filterContainer}>
				<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
					{filters.map((filter) => (
						<TouchableOpacity
							key={filter.key}
							style={[
								styles.button,
								{
									backgroundColor: filter.backgroundColor,
									borderColor: filter.borderColor,
								},
							]}
							onPress={() => changeFilter(filter.key)}
						>
							<Text>{filter.label}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	filterContainer: {
		position: 'absolute',
		width: '100%',
		paddingVertical: 4,
		zIndex: 10,
	},
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
