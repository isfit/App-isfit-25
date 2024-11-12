import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FAQQuestion from '../components/FAQQuestion';
import { faqQuestions } from './data/faqData';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0197CC',
	},
	descriptionText: {
		fontSize: 15,
		margin: 10,
		fontWeight: '300',
	},
	linkText: {
		fontSize: 15,
		color: '#0089E3',
	},
	linkTextDescription: {
		fontSize: 15,
		paddingLeft: 10,
		paddingRight: 4,
		paddingBottom: 8,
		fontWeight: '300',
	},
	descriptionTextContainer: {
		backgroundColor: '#FFFFFF',
	},
	dateTitle: {
		fontSize: 18,
		paddingTop: 4,
		paddingBottom: 4,
		paddingHorizontal: 15,
		color: '#FFFFFF',
		fontWeight: '500',
	},
});

export default function FAQScreen({ navigation }) {
	const [questions, setQuestions] = useState(faqQuestions);

	return (
		<ScrollView style={styles.container}>
			<View style={styles.descriptionTextContainer}>
				<Text style={styles.descriptionText}>
					Welcome to the information page for participants! Here you can find
					some practical information regarding the festival. Additional
					information will be posted on the ISFiT25 website.
				</Text>
				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.linkTextDescription}>
						For more information visit
					</Text>
					<TouchableOpacity
						onPress={() =>
							Linking.openURL('https://www.isfit.org/participant-info')
						}
						style={{ backgroundColor: 'white' }}
					>
						<Text style={styles.linkText}>isfit.org</Text>
					</TouchableOpacity>
				</View>
			</View>
			{questions.map((question, i) => {
				return (
					<View key={i}>
						<Text style={styles.dateTitle}>{question.category}</Text>
						{question.questions.map((itm, j) => {
							return (
								<FAQQuestion
									key={j}
									title={itm.title}
									data={itm.data}
									navigation={navigation}
								/>
							);
						})}
					</View>
				);
			})}
		</ScrollView>
	);
}
