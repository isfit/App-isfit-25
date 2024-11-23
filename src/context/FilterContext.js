import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
	const [activeFilter, setActiveFilter] = useState(null); // Start with null
	const [favorites, setFavorites] = useState([]);

	const changeFilter = (filter) => {
		setActiveFilter(filter);
	};

	// Load favorites from AsyncStorage
	const loadFavorites = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem(
				'@ISFiTApp23_FavoriteMarkers'
			);
			const storedFavorites = jsonValue != null ? JSON.parse(jsonValue) : [];
			setFavorites(storedFavorites);

			// Set default filter based on favorites
			if (storedFavorites.length > 0) {
				setActiveFilter('Favorites');
			} else {
				setActiveFilter('All');
			}
		} catch (e) {
			console.error('Error fetching favorites:', e);
			setActiveFilter('All');
		}
	};

	useEffect(() => {
		loadFavorites();
	}, []);

	const addFavorite = async (key) => {
		try {
			const updatedFavorites = [...favorites, key];
			setFavorites(updatedFavorites);
			await AsyncStorage.setItem(
				'@ISFiTApp23_FavoriteMarkers',
				JSON.stringify(updatedFavorites)
			);
		} catch (e) {
			console.error('Error adding favorite:', e);
		}
	};

	const removeFavorite = async (key) => {
		try {
			const updatedFavorites = favorites.filter((favKey) => favKey !== key);
			setFavorites(updatedFavorites);
			await AsyncStorage.setItem(
				'@ISFiTApp23_FavoriteMarkers',
				JSON.stringify(updatedFavorites)
			);
		} catch (e) {
			console.error('Error removing favorite:', e);
		}
	};

	if (activeFilter === null) {
		// Show a loading indicator or return null while initializing
		return null;
	}

	return (
		<FilterContext.Provider
			value={{
				activeFilter,
				changeFilter,
				favorites,
				addFavorite,
				removeFavorite,
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};
