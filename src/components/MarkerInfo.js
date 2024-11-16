import React, { useEffect, useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const MarkerInfo = ({ title, bilde, information, photographer, itemId }) => {
	const [isFavorite, setIsFavorite] = useState(false);

	// Logic for storing a favorite
	const storeFavorites = async (markerKey) => {
		try {
			const storedFavorites = await getStoredFavorites();
			storedFavorites.push(markerKey);
			await AsyncStorage.setItem(
				'@ISFiTApp23_FavoriteMarkers',
				JSON.stringify(storedFavorites)
			);
			setIsFavorite(true);
		} catch (e) {
			console.log(e);
		}
	};

	// Logic for removing a favorite
	const removeFavorites = async (markerKey) => {
		try {
			const storedFavorites = await getStoredFavorites();
			const filteredFavorites = storedFavorites.filter(
				(item) => item !== markerKey
			);
			await AsyncStorage.setItem(
				'@ISFiTApp23_FavoriteMarkers',
				JSON.stringify(filteredFavorites)
			);
			setIsFavorite(false);
		} catch (e) {
			console.log(e);
		}
	};

	// Check if the item is already stored as a favorite
	const isStored = async (markerKey) => {
		try {
			const storedFavorites = await getStoredFavorites();
			setIsFavorite(storedFavorites.includes(markerKey));
		} catch (e) {
			console.log(e);
		}
	};

	// Utility function to get stored favorites
	const getStoredFavorites = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem(
				'@ISFiTApp23_FavoriteMarkers'
			);
			return jsonValue != null ? JSON.parse(jsonValue) : [];
		} catch (e) {
			console.log(e);
			return [];
		}
	};

	// Initialize favorite status
	useEffect(() => {
		isStored(itemId);
	}, []);

	return (
		<View>
			{/* Image and Photographer */}
			<View style={styles.imageContainer}>
				<Image style={styles.image} source={bilde} />
				<Text
					style={{
						paddingLeft: width * 0.05,
						fontSize: 12,
						fontStyle: 'italic',
					}}
				>
					{photographer}
				</Text>
			</View>

			{/* Title and Heart Icon */}
			<View style={styles.headerWithHeart}>
				<Text style={styles.headerText}>{title}</Text>
				<TouchableOpacity
					style={{ marginLeft: 10 }}
					onPress={
						isFavorite
							? () => removeFavorites(itemId)
							: () => storeFavorites(itemId)
					}
				>
					<FontAwesome
						name={isFavorite ? 'heart' : 'heart-o'}
						size={25}
						color='#37894e'
					/>
				</TouchableOpacity>
			</View>

			{/* Information */}
			<View style={styles.textContainer}>
				<Text style={styles.textStyle}>{information}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerWithHeart: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
		paddingVertical: 10,
		backgroundColor: '#f9f5f9',
	},
	headerText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		flex: 1,
	},
	image: {
		width: '100%',
		height: undefined,
		aspectRatio: 1,
	},
	imageContainer: {
		alignContent: 'center',
		width: width,
	},
	textContainer: {
		paddingTop: height * 0.001,
		width: width,
		textAlign: 'center',
	},
	textStyle: {
		textAlign: 'left',
		paddingTop: height * 0.02,
		margin: width * 0.053,
		fontSize: 15,
		fontWeight: '300',
	},
});

export default MarkerInfo;
