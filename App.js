import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import EventScreen from './src/screens/EventScreen';
import MapScreen from './src/screens/MapScreen';
import ThemeScreen from './src/screens/ThemeScreen';
import FAQScreen from './src/screens/FAQScreen';
import InformationScreen from './src/screens/InformationScreen';
import MarkerInfoScreen from './src/screens/MarkerInfoScreen';
import AttractionBoxScreen from './src/screens/AttractionBoxScreen';
import * as Font from 'expo-font';
import { FilterProvider } from './src/context/FilterContext';

const launchScreenColors = ['#C92332', '#FF6D8A', '#71DCFF', '#0078A3'];

const MapsStack = createStackNavigator();
function MapsStackScreen() {
	return (
		<MapsStack.Navigator screenOptions={{ headerShown: false }}>
			<MapsStack.Screen name='MapScreen' component={MapScreen} />
			<MapsStack.Screen
				name='AttractionBoxScreen'
				component={AttractionBoxScreen}
			/>
			<MapsStack.Screen name='MarkerInfoScreen' component={MarkerInfoScreen} />
		</MapsStack.Navigator>
	);
}

const Tab = createBottomTabNavigator();
function HomeTabs({ showAttractions, setShowAttractions }) {
	return (
		<Tab.Navigator initialRouteName='Home'>
			<Tab.Screen
				name='Events'
				component={EventScreen}
				options={{
					headerTintColor: '#FFF5F3',
					backgroundColor: '#0078A3',
					headerStyle: {
						backgroundColor: '#0078A3',
					},
					headerTitleAlign: 'center',
					tabBarIcon: ({ color }) => (
						<FontAwesome name='calendar' size={22} color={color} />
					),
					tabBarActiveTintColor: '#0078A3',
				}}
			/>
			<Tab.Screen
				name='Theme'
				component={ThemeScreen}
				options={{
					headerTintColor: '#FFF5F3',
					headerStyle: {
						backgroundColor: '#C92332', // Red
					},
					headerTitleAlign: 'center',
					tabBarIcon: ({ color }) => (
						<Entypo name='megaphone' size={23} color={color} />
					),
					tabBarActiveTintColor: '#C92332',
				}}
			/>
			<Tab.Screen
				name='Explore'
				component={MapsStackScreen}
				listeners={({ navigation }) => ({
					tabPress: (e) => {
						setShowAttractions(false);
						navigation.navigate('Explore', {
							screen: 'MapScreen', // Specify the nested screen
						});
					},
				})}
				options={({ navigation }) => {
					const currentRoute = navigation
						.getState()
						?.routes?.find((r) => r.name === 'Explore')
						?.state?.routes?.slice(-1)[0]?.name;

					const isOnMarkerInfoScreen = currentRoute === 'MarkerInfoScreen';

					return {
						headerTitle: 'Explore Trondheim',
						headerTintColor: '#FFF5F3',
						headerStyle: {
							backgroundColor: '#FF6D8A', // Pink
						},
						tabBarIcon: ({ color }) => (
							<Entypo name='globe' size={23} color={color} />
						),
						tabBarActiveTintColor: '#FF6D8A',
						headerLeft: () =>
							isOnMarkerInfoScreen ? (
								<TouchableOpacity
									onPress={() => {
										navigation.navigate(
											showAttractions ? 'AttractionBoxScreen' : 'MapScreen'
										);
									}}
									style={{ marginLeft: 10 }}
								>
									<FontAwesome name='arrow-left' size={30} color='#FFF5F3' />
								</TouchableOpacity>
							) : null,
						headerRight: () =>
							isOnMarkerInfoScreen ? null : (
								<TouchableOpacity
									onPress={() => {
										setShowAttractions(!showAttractions);
										navigation.navigate(
											showAttractions ? 'MapScreen' : 'AttractionBoxScreen'
										);
									}}
									style={{
										marginRight: 10,
										backgroundColor: 'transparent', // Make the button transparent
									}}
								>
									<Entypo name={showAttractions ? 'map' : 'list'} size={30} />
								</TouchableOpacity>
							),
					};
				}}
			/>
			<Tab.Screen
				name='Information'
				component={FAQScreen}
				options={{
					headerTintColor: '#FFF5F3',
					headerStyle: {
						backgroundColor: '#71DCFF', // Blue
					},
					headerTitleAlign: 'center',
					tabBarIcon: ({ color }) => (
						<FontAwesome5 name='question' size={20} color={color} />
					),
					tabBarActiveTintColor: '#71DCFF',
				}}
			/>
		</Tab.Navigator>
	);
}

const MainStack = createStackNavigator();
function App() {
	const [showAttractions, setShowAttractions] = useState(false); // Default to showing MapsStackScreen

	return (
		<FilterProvider>
			<NavigationContainer>
				<MainStack.Navigator screenOptions={{ headerShown: false }}>
					<MainStack.Screen name='HomeTabs'>
						{() => (
							<HomeTabs
								showAttractions={showAttractions}
								setShowAttractions={setShowAttractions}
							/>
						)}
					</MainStack.Screen>
					<MainStack.Screen
						name='Info'
						component={InformationScreen}
						options={({ navigation }) => {
							return {
								headerShown: true, // Enable the header
								headerTitle: 'Theme',
								headerTintColor: '#FFF5F3',
								headerStyle: {
									backgroundColor: '#C92332', // Red
								},
								headerLeft: () => (
									<TouchableOpacity
										onPress={() => {
											navigation.navigate('Theme');
										}}
										style={{ marginLeft: 10 }}
									>
										<FontAwesome name='arrow-left' size={30} color='#FFF5F3' />
									</TouchableOpacity>
								),
							};
						}}
					/>
					<MainStack.Screen name='Show' component={EventScreen} />
				</MainStack.Navigator>
			</NavigationContainer>
		</FilterProvider>
	);
}

function SplashScreen(props) {
	const [fontLoaded, setFontLoaded] = useState(false);
	useEffect(() => {
		async function loadFont() {
			await Font.loadAsync({
				HVDRowdyRegular: require('./src/assets/fonts/HVD_Rowdy.otf'),
			});
			setFontLoaded(true);
		}
		loadFont();
		const timer = setTimeout(() => {
			props.setLoading(!props.loading);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor:
					launchScreenColors[
						Math.floor(Math.random() * launchScreenColors.length)
					],
			}}
		>
			<Text
				style={[fontstyles.text, fontLoaded ? fontstyles.customFont : null]}
			>
				isfit25{'\n'}power
			</Text>
		</View>
	);
}

const fontstyles = StyleSheet.create({
	text: {
		fontSize: 96,
		color: Math.random() > 0.5 ? '#141414' : '#FFF5F3',
	},
	customFont: {
		fontFamily: 'HVDRowdyRegular',
	},
});

export default () => {
	const [loading, setLoading] = useState(true);
	if (loading) {
		return <SplashScreen loading={loading} setLoading={setLoading} />;
	} else {
		return <App />;
	}
};
