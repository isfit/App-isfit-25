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
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapWithMarkers from '../components/MapWithMarkers';

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
				{/* Filter Buttons Section */}
				<View style={{ backgroundColor: '#D8BFD8', paddingVertical: 4 }}>
					<ScrollView horizontal={true}>
						<TouchableOpacity
							style={styles.greenFilterButton}
							onPress={() => this.onFilterChange('All')}
						>
							<Text>All places</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.purpleFilterButton}
							onPress={() => this.onFilterChange('Favorites')}
						>
							<Text>Favorites</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.blueFilterButton}
							onPress={() => this.onFilterChange('Trondheim')}
						>
							<Text>Trondheim 101</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.redFilterButton}
							onPress={() => this.onFilterChange('Help')}
						>
							<Text>Help</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.orangeFilterButton}
							onPress={() => this.onFilterChange('Cafes')}
						>
							<Text>Cafés to relax in</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.orangeFilterButton}
							onPress={() => this.onFilterChange('Eat')}
						>
							<Text>Places to eat</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.orangeFilterButton}
							onPress={() => this.onFilterChange('Drink')}
						>
							<Text>Places to drink</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.greenFilterButton}
							onPress={() => this.onFilterChange('FreshAir')}
						>
							<Text>Fresh air</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.greenFilterButton}
							onPress={() => this.onFilterChange('Activities')}
						>
							<Text>Activity for the body and soul</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.pinkFilterButton}
							onPress={() => this.onFilterChange('Shopping')}
						>
							<Text>Boutiques & Vintage shopping</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.purpleFilterButton}
							onPress={() => this.onFilterChange('Museums')}
						>
							<Text>Museums</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.yellowFilterButton}
							onPress={() => this.onFilterChange('Party')}
						>
							<Text>Party places</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>

				{/* Map with Icon */}
				<View style={{ flex: 1 }}>
					{/* Map section */}
					<MapWithMarkers markersArray={this.state.activeMarkers} />

					{/* List icon overlay */}
					<TouchableOpacity
						style={styles.iconContainer}
						onPress={() => this.onFilterChange('Museums')}
					></TouchableOpacity>
				</View>
			</View>
		);
	}
}

// TODO: refactor to be used to store favorite markers and events
const getStoredFavorites = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem('@ISFiTApp23_FavoriteMarkers');
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	} catch (e) {
		console.log(e);
		return [];
	}
};

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
