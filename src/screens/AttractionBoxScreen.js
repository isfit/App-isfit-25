import React, { useEffect, useRef, useState, useContext } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { attractionMarkers } from '../assets/attractionMarkers';
import AttractionMarkerBox from '../components/AttractionMarkerBox';

import { filters } from '../utils/ExploreUtils';
import { FilterContext } from '../context/FilterContext';

export default function AttractionBoxScreen({ navigation }) {
	const scrollRef = useRef();
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
			<View style={{ backgroundColor: '#FFF', paddingVertical: 4 }}>
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
			<ScrollView ref={scrollRef}>
				{activeMarkers.map((m, i) => (
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
