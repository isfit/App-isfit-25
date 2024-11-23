import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	faUtensils,
	faCoffee,
	faHiking,
	faLandmark,
	faHeart,
	faBasketShopping,
	faWineGlass,
	faGlassCheers,
	faMonument,
	faPersonBiking,
	faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // Earth's radius in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in km
};

export const getIconForFilter = (filterKey) => {
	switch (filterKey) {
		case 'Trondheim':
			return <FontAwesomeIcon icon={faMonument} size={30} color='#7CD1ED' />;
		case 'Help':
			return <FontAwesomeIcon icon={faHeart} size={30} color='#FF4C4C' />;
		case 'Cafes':
			return <FontAwesomeIcon icon={faCoffee} size={30} color='#D2691E' />;
		case 'Eat':
			return <FontAwesomeIcon icon={faUtensils} size={30} color='#FFA500' />;
		case 'Drink':
			return <FontAwesomeIcon icon={faWineGlass} size={30} color='#FFD700' />;
		case 'FreshAir':
			return <FontAwesomeIcon icon={faHiking} size={30} color='#87CEEB' />;
		case 'Activities':
			return (
				<FontAwesomeIcon icon={faPersonBiking} size={30} color='#32CD32' />
			);
		case 'Shopping':
			return (
				<FontAwesomeIcon icon={faBasketShopping} size={30} color='#FF69B4' />
			);
		case 'Museums':
			return <FontAwesomeIcon icon={faLandmark} size={30} color='#9370DB' />;
		case 'Party':
			return <FontAwesomeIcon icon={faGlassCheers} size={30} color='#FF6347' />;
		case 'All':
			return <FontAwesomeIcon icon={faMonument} size={30} color='#56BC72' />;
		default:
			return <FontAwesomeIcon icon={faLocationDot} size={30} color='#FF6D8A' />;
	}
};

export const filters = [
	{
		key: 'All',
		label: 'All places',
		backgroundColor: '#56BC72',
		borderColor: '#37894E',
	},
	{
		key: 'Favorites',
		label: 'Favorites',
		backgroundColor: '#8A2BE2', // Unique purple
		borderColor: '#5A189A',
	},
	{
		key: 'Trondheim',
		label: 'Trondheim 101',
		backgroundColor: '#7CD1ED',
		borderColor: '#0197CC',
	},
	{
		key: 'Help',
		label: 'Help',
		backgroundColor: '#FF4C4C', // Strong red for "Help"
		borderColor: '#A70000',
	},
	{
		key: 'Cafes',
		label: 'Cafés to relax in',
		backgroundColor: '#D2691E', // Brown-orange
		borderColor: '#A0522D',
	},
	{
		key: 'Eat',
		label: 'Places to eat',
		backgroundColor: '#FFA500', // Bright orange
		borderColor: '#CC8400',
	},
	{
		key: 'Drink',
		label: 'Places to drink',
		backgroundColor: '#FFD700', // Golden yellow
		borderColor: '#CCAC00',
	},
	{
		key: 'FreshAir',
		label: 'Fresh air',
		backgroundColor: '#87CEEB', // Light blue
		borderColor: '#4682B4',
	},
	{
		key: 'Activities',
		label: 'Activity for the body and soul',
		backgroundColor: '#32CD32', // Lime green
		borderColor: '#228B22',
	},
	{
		key: 'Shopping',
		label: 'Boutiques & Vintage shopping',
		backgroundColor: '#FF69B4', // Hot pink
		borderColor: '#C71585',
	},
	{
		key: 'Museums',
		label: 'Museums',
		backgroundColor: '#9370DB', // Medium purple
		borderColor: '#6A5ACD',
	},
	{
		key: 'Party',
		label: 'Party places',
		backgroundColor: '#FF6347', // Tomato red
		borderColor: '#FF4500',
	},
];
