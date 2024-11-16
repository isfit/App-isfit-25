import React from 'react';
import { View, ScrollView } from 'react-native';
import MarkerInfo from '../components/MarkerInfo';

const MarkerInfoScreen = ({ route }) => {
	const { itemId, itemTitle, itemPicture, itemInformation, itemPhotographer } =
		route.params;

	return (
		<View style={{ flex: 1, backgroundColor: '#f9f5f9' }}>
			<ScrollView>
				<MarkerInfo
					itemId={itemId}
					title={itemTitle}
					bilde={itemPicture}
					information={itemInformation}
					photographer={itemPhotographer}
				/>
			</ScrollView>
		</View>
	);
};

export default MarkerInfoScreen;
