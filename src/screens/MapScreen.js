import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import { attractionMarkers } from '../assets/attractionMarkers';
import MapWithMarkers from '../components/MapWithMarkers';
import { filters, getStoredFavorites } from '../utils/ExploreUtils';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default class MapScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data,
			activeFilter: 'All',
			activeMarkers: attractionMarkers,
		};
	}

	// Lifecycle method to check for favorites on mount
	async componentDidMount() {
		await this.updateFavorites(); // Load favorites on mount
		this.focusListener = this.props.navigation.addListener('focus', () => {
			if (this.state.activeFilter === 'Favourites') {
				this.updateFavorites();
			}
		});
	}

	componentWillUnmount() {
		// Remove the listener on unmount
		this.focusListener();
	}

	// Helper function to load favorites from AsyncStorage
	async updateFavorites() {
		const storedFavorites = await getStoredFavorites();
		this.setState({ storedFavorites }, () => {
			if (storedFavorites.length > 0) {
				this.applyFavoriteFilter(); // Activate Favorites filter if there are favorites
			} else {
				this.applyAllFilter(); // Default to All filter if no favorites
			}
		});
	}

	applyFavoriteFilter() {
		getStoredFavorites().then((storedFavorites) => {
			filteredMarkersList = attractionMarkers.filter((x) =>
				storedFavorites.includes(x.key)
			);
			this.setState({
				activeFilter: 'Favourites',
				activeMarkers: filteredMarkersList,
			});
		});
	}

	applyAllFilter() {
		filteredMarkersList = attractionMarkers;
		this.setState({
			activeFilter: 'All',
			activeMarkers: filteredMarkersList,
		});
	}

	onFilterChange(filter) {
		let filteredMarkersList = [];
		if (filter === 'Favorites') {
			this.applyFavoriteFilter();
		} else if (filter === 'All') {
			this.applyAllFilter();
		} else {
			filteredMarkersList = attractionMarkers.filter(
				(x) => x.filterKey === filter
			);
			this.setState({
				activeFilter: filter,
				activeMarkers: filteredMarkersList,
			});
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{/* Map section */}
				<View style={{ flex: 1 }}>
					<MapWithMarkers markersArray={this.state.activeMarkers} />
				</View>

				{/* Filter Buttons Section */}
				<View style={styles.filterContainer}>
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
								onPress={() => this.onFilterChange(filter.key)}
							>
								<Text>{filter.label}</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				{/* List icon overlay */}
				<TouchableOpacity
					style={styles.iconContainer}
					onPress={() => this.onFilterChange('Museums')}
				></TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	iconContainer: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 10,
	},
	iconImage: {
		width: 40,
		height: 40,
		resizeMode: 'contain',
	},
	mapStyle: {
		width: width,
		height: height,
	},
	image: {
		resizeMode: 'contain',
		width: width * 0.1,
		height: width * 0.1,
	},
	filterContainer: {
		position: 'absolute', // Ensure it's on top of the map
		width: '100%', // Stretch across the screen
		paddingVertical: 4,
		zIndex: 10, // Ensure it's above the map
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
