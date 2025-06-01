// app/screens/UserListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	View,
	Text,
	FlatList,
	Pressable,
	TouchableOpacity,
	TextInput,
	StyleSheet,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetUsersQuery, usePrefetch } from '@/src/services/userApi';
import { useRouter } from 'expo-router';

export default function UserListScreen() {
	const router = useRouter();
	const [search, setSearch] = useState('');
	const [cachedUsers, setCachedUsers] = useState(null);
	const [refreshAnimationKey, setRefreshAnimationKey] = useState(0); // key for re-rendering on refresh
	const { data: users, error, isLoading, refetch } = useGetUsersQuery();

	// Saving the latest data in localStorage
	useEffect(() => {
		if (users) {
			localStorage.setItem('cachedUsers', JSON.stringify(users));
		}
	}, [users]);

	// Load stored users from localStorage on initial render
	useEffect(() => {
		const storedUsers = localStorage.getItem('cachedUsers');
		if (storedUsers) {
			setCachedUsers(JSON.parse(storedUsers));
		}
	}, []);

	// Use cached users if available, otherwise use fetched users
	const displayedUsers = users || cachedUsers || [];

	// Filter users based on search input
	const filteredUsers = displayedUsers.filter((user) =>
		user.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleRefresh = () => {
		setRefreshAnimationKey((prev) => prev + 1);
		refetch();
	};

	const prefetchUser = usePrefetch('getUserById');

	return (
		<View style={styles.container}>
			{/* Search field */}
			<Text style={styles.label}>Search by name:</Text>
			<View style={styles.searchContainer}>
				<Text style={styles.icon}>🔍</Text>
				<TextInput
				placeholder="Search..."
				value={search}
				onChangeText={setSearch}
				style={styles.searchInput}
				/>
			</View>

			{/* Refresh button */}
			<Animated.View entering={FadeInDown.duration(400)}>
				<LinearGradient
					colors={['#00c6ff', '#007eff']}
					style={styles.gradientButton}
				>
					<TouchableOpacity
						style={styles.refreshButton}
						onPress={handleRefresh}
						disabled={isLoading}
					>
						<Text style={styles.refreshButtonText}>
							{isLoading ? '🔄 Loading...' : '🔄 Refresh'}
						</Text>
					</TouchableOpacity>
				</LinearGradient>
			</Animated.View>

			{/* Status: loading */}
			{isLoading && <LoadingState />}

			{/* Status: error */}
			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>Error loading users</Text>
					<TouchableOpacity style={styles.retryButton} onPress={refetch}>
						<Text style={styles.retryButtonText}>Try Again</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Status: no results */}
			{!isLoading && !error && filteredUsers?.length === 0 && search && (
				<Text style={styles.noResults}>No users found for "{search}"</Text>
			)}

			{/* Status: no results when no search term */}
			{!isLoading && !error && filteredUsers?.length === 0 && !search && (
				<Text style={styles.noData}>No users found</Text>
			)}

			{/* Status: uploaded successfully */}
			{!isLoading && !error && (users || cachedUsers) && (
				<FlatList
					data={filteredUsers}
					key={refreshAnimationKey} // force re-render on refresh
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<Animated.View entering={FadeInDown.delay(50)}>
							<Pressable
								style={styles.card}
								onPress={() => {
									router.push(`/details/${item.id}`);
									prefetchUser(item.id);
								}}
								onHoverIn={() => prefetchUser(item.id)} // for web
								onTouchStart={() => prefetchUser(item.id)} // for mobile
							>
								<Text style={styles.cardTitle}>{item.name}</Text>
								<Text style={styles.cardEmail}>{item.email}</Text>
							</Pressable>
						</Animated.View>
					)}
				/>
			)}
		</View>
	);
}

{/* Loading state component */}
function LoadingState() {
	const [dots, setDots] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev + 1) % 4);
		}, 500);

		return () => clearInterval(interval);
	}, []);

	const loadingText = `Data loading${".".repeat(dots)} please wait`;

	return (
		<View style={styles.loadingContainer}>
			<ActivityIndicator size="large" color="#007AFF" />
			<Text style={styles.loadingText}>{loadingText}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	loading: {
		textAlign: 'center',
		marginTop: 20,
		fontSize: 16,
		color: '#333',
	},
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 40,
	},
	errorText: {
		color: 'red',
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	retryButton: {
		backgroundColor: '#FFA500',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	retryButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	noResults: {
		textAlign: 'center' as 'center',
		fontSize: 16,
		color: '#e74c3c', // red color for no results
		marginTop: 20,
		fontStyle: 'italic',
	},
	noData: {
		textAlign: 'center' as 'center',
		fontSize: 18,
		fontWeight: 'bold' as 'bold',
		color: '#777',
		marginTop: 40,
		paddingHorizontal: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	loadingText: {
		fontSize: 16,
		fontStyle: 'italic',
		color: '#888',
		textAlign: 'center' as 'center',
	},
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f9f9f9',
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 25,
		paddingHorizontal: 16,
		marginBottom: 12,
		backgroundColor: '#fff',
		elevation: 2,
	},
	icon: {
		marginRight: 10,
		color: '#888',
	},
	searchInput: {
		flex: 1,
		height: 40,
		fontSize: 16,
	},
	gradientButton: {
		paddingVertical: 12,
		borderRadius: 25,
		marginBottom: 12,
		alignItems: 'center',
	},
	refreshButton: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	refreshButtonText: {
		color: 'white',
		fontWeight: 'bold' as 'bold',
		fontSize: 16,
	},
	card: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	cardEmail: {
		fontSize: 14,
		color: '#555',
	},
	error: {
		color: 'red',
		textAlign: 'center',
		marginVertical: 16,
	},
});