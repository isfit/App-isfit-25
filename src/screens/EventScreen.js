import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import EventBox from '../components/EventBox';

export default function EventScreen() {
	const [samfundetGroups, setSamfundetGroups] = useState([]);

	const getFeed = async () => {
		const data = [];

		await fetch('https://www.samfundet.no/rss')
			.then((response) => response.text())
			.then((responseData) =>
				//states which type of data we want to use in the app
				rssParser.parse(responseData, [
					'body',
					'agelimit',
					'location',
					'category',
					'link',
				])
			)
			.then((rss) => {
				rss.items.map((item) => {
					data.push({
						title: item.title,
						link: englishLink(item.links[0].url),
						date: item.published,
					});
				});
			});

		const newDateArray = [];
		data.map((item, index) => {
			newDateArray.push({
				...item,
				date: new Date(
					item.date.substring(12, 17),
					'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(
						item.date.substring(8, 11)
					) / 3,
					item.date.substring(5, 7),
					item.date.substring(17, 19),
					item.date.substring(20, 22)
				),
			});
		});

		newDateArray.sort((a, b) => {
			return new Date(a.date) - new Date(b.date);
		});

		const groups = newDateArray.reduce((groups, item) => {
			const date = item.date.toString().substring(0, 16);
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(item);
			return groups;
		}, {});

		const groupArrays = Object.keys(groups).map((date) => {
			return {
				date,
				events: groups[date],
			};
		});

		setSamfundetGroups(groupArrays);
	};

	function englishLink(norwegianLink) {
		var splittedLink = norwegianLink.split('/arrangement/');
		return splittedLink[0] + '/en/events/' + splittedLink[1];
	}

	useEffect(() => {
		getFeed();
	}, []);

	return (
		<View>
			<ScrollView>
				{samfundetGroups.map((group, i) => {
					// From here on!!
					return (
						<View key={i}>
							<Text style={styles.dateTitle}>{group.date}</Text>
							{group.events.length > 0 &&
								group.events.map((itm, j) => {
									return (
										<EventBox
											key={j}
											title={itm.title}
											date={itm.date}
											link={itm.link}
											image={itm.image}
										/>
									);
								})}
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	filterContainer: {
		height: 55,
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingTop: 2,
		justifyContent: 'space-evenly',
	},
	dateTitle: {
		fontSize: 17,
		backgroundColor: '#FFFFFF',
		paddingTop: 4,
		paddingHorizontal: 15,
	},
});
