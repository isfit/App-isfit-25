import React, { useEffect, useState } from 'react';
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import MarkerInfo from '../components/MarkerInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

//gets right params from the navigaton in MapScreen and through route prop.
const MarkerInfoScreen = ({ route, navigation }) => {
	const { itemId, itemTitle, itemPicture, itemInformation, itemPhotographer } =
		route.params;

	const [isFavorite, setIsFavorite] = useState(false);

	const storeFavorites = async (markerKey) => {
		try {
			getStoredFavorites().then((storedFavorites) => {
				storedFavorites.push(markerKey);
				const jsonValue = JSON.stringify(storedFavorites);
				AsyncStorage.setItem('@ISFiTApp23_FavoriteMarkers', jsonValue).then(
					() => setIsFavorite(true)
				);
			});
		} catch (e) {
			console.log(e);
		}
	};

	const removeFavorites = async (markerKey) => {
		try {
			getStoredFavorites().then((storeFavorites) => {
				let filtered = storeFavorites.filter((item) => item !== markerKey);
				AsyncStorage.setItem(
					'@ISFiTApp23_FavoriteMarkers',
					JSON.stringify(filtered)
				).then(() => {
					setIsFavorite(false);
				});
			});
		} catch (e) {
			console.log(e);
		}
	};

	const isStored = async (markerKey) => {
		try {
			await getStoredFavorites().then((storeFavorites) => {
				storeFavorites.map((favorite) => {
					if (Number(favorite) == Number(markerKey)) {
						setIsFavorite(true);
					}
				});
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		isStored(itemId);
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: '#f9f5f9' }}>
			<ScrollView style={{ flexGrow: 1 }}>
				<View style={styles.topButtonContainer}>
					<TouchableOpacity onPress={() => navigation.navigate('MapsScreen')}>
						<Feather name='arrow-left' size={40} color='#37894e' />
					</TouchableOpacity>
					{isFavorite ? (
						<TouchableOpacity
							style={{ paddingTop: 4, paddingRight: 4 }}
							onPress={async () => {
								await removeFavorites(itemId);
							}}
						>
							<FontAwesome name='heart' size={35} color='#37894e' />
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={{ paddingTop: 4, paddingRight: 4 }}
							onPress={async () => {
								await storeFavorites(itemId);
							}}
						>
							<FontAwesome name='heart-o' size={35} color='#37894e' />
						</TouchableOpacity>
					)}
				</View>
				<Text>
					<MarkerInfo
						key={itemId}
						title={itemTitle}
						text={itemId}
						bilde={itemPicture}
						information={itemInformation}
						photographer={itemPhotographer}
					/>
				</Text>
			</ScrollView>
		</View>
	);
};

// TODO: refactor to be used to store favorite markers and events

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
	topButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export default MarkerInfoScreen;
