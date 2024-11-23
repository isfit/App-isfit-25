import React, { useContext } from 'react';
import {
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FilterContext } from '../context/FilterContext';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const MarkerInfo = ({ title, bilde, information, photographer, itemId }) => {
	const { favorites, addFavorite, removeFavorite } = useContext(FilterContext);
	const isFavorite = favorites.includes(itemId);

	const toggleFavorite = () => {
		if (isFavorite) {
			removeFavorite(itemId);
		} else {
			addFavorite(itemId);
		}
	};

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
				<TouchableOpacity style={{ marginLeft: 10 }} onPress={toggleFavorite}>
					<FontAwesome
						name={isFavorite ? 'heart' : 'heart-o'}
						size={25}
						color='#FF6D8A'
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
