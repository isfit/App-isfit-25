import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity, Image } from 'react-native';
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
import AttractionBoxInfoScreen from './src/screens/AttractionBoxInfoScreen';
import * as Font from 'expo-font';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const launchScreenColors = ['#C92332', '#FF6D8A', '#71DCFF', '#0078A3'];

const MapsStack = createStackNavigator();
function MapsStackScreen() {
	return (
		<MapsStack.Navigator screenOptions={{ headerShown: false }}>
			<MapsStack.Screen name='MapsScreen' component={MapScreen} />
			<MapsStack.Screen name='MarkerInfoScreen' component={MarkerInfoScreen} />
		</MapsStack.Navigator>
	);
}

const AttractionStack = createStackNavigator();
function AttractionStackScreen() {
	return (
		<AttractionStack.Navigator screenOptions={{ headerShown: false }}>
			<AttractionStack.Screen
				name='AttractionBoxScreen'
				component={AttractionBoxScreen}
			/>
			<AttractionStack.Screen
				name='AttractionBoxInfoScreen'
				component={AttractionBoxInfoScreen}
			/>
		</AttractionStack.Navigator>
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
				component={showAttractions ? AttractionStackScreen : MapsStackScreen}
				options={{
					headerTitle: 'Explore Trondheim',
					headerTintColor: '#FFF5F3',
					headerStyle: {
						backgroundColor: '#FF6D8A', // Pink
					},
					tabBarIcon: ({ color }) => (
						<Entypo name='globe' size={23} color={color} />
					),
					tabBarActiveTintColor: '#FF6D8A',
					headerRight: () => (
						<TouchableOpacity
							onPress={() => setShowAttractions(!showAttractions)} // Toggle the state
							style={{
								marginRight: 10,
								backgroundColor: 'transparent', // Make the button transparent
							}}
						>
							<Image
								source={showAttractions ? require('./src/assets/ExploreTrondheim/mapicon.png') : require('./src/assets/ExploreTrondheim/listicon.png')}
								style={{ width: 24, height: 24 }} // Adjust size as necessary
							/>
						</TouchableOpacity>
					),
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
		<NavigationContainer>
			<MainStack.Navigator screenOptions={{ headerShown: false }}>
				<MainStack.Screen name='HomeTabs'>
					{() => <HomeTabs showAttractions={showAttractions} setShowAttractions={setShowAttractions} />}
				</MainStack.Screen>
				<MainStack.Screen name='Info' component={InformationScreen} />
				<MainStack.Screen name='Show' component={EventScreen} />
			</MainStack.Navigator>
		</NavigationContainer>
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
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: launchScreenColors[Math.floor(Math.random() * launchScreenColors.length)],
			}}
		>
			<Text style={[fontstyles.text, fontLoaded ? fontstyles.customFont : null]}>
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

const styles = StyleSheet.create({
	titletext: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
	},
	randomText: {
		paddingTop: height * 0.01,
		fontSize: 16,
		color: 'white',
	},
	picture: {
		alignSelf: 'center',
		margin: width * 0.5,
		height: height * 0.5,
		resizeMode: 'contain',
	},
});
