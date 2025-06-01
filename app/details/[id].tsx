// app/details/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetUserByIdQuery } from '@/src/services/userApi';

export default function UserDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isLoading, error } = useGetUserByIdQuery(Number(id));
	const [cachedUser, setCachedUser] = useState(null);

	// Load cached user from localStorage on initial render
	useEffect(() => {
		const storedUser = localStorage.getItem(`user_${id}`);
		if (storedUser) {
			setCachedUser(JSON.parse(storedUser));
		}
	}, [id]);

	// Use cached user if available, otherwise use fetched data
	useEffect(() => {
		if (data) {
			localStorage.setItem(`user_${id}`, JSON.stringify(data));
		}
	}, [data, id]);

	if (isLoading && !cachedUser)
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Data loading...</Text>
			</View>
		);

	if ((error || !data) && !cachedUser)
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Loading error</Text>
			</View>
		);

	const user = data || cachedUser;

	if (!user) {
		return <Text style={styles.errorUser}>User not found</Text>;
	}

	return (
		<View style={styles.detailsContainer}>
		<Text style={styles.detailLabel}>Name:</Text>
		<Text style={styles.detailValue}>{user.name}</Text>

		<Text style={styles.detailLabel}>Email:</Text>
		<Text style={styles.detailValue}>{user.email}</Text>

		<Text style={styles.detailLabel}>Phone number:</Text>
		<Text style={styles.detailValue}>{user.phone}</Text>

		<Text style={styles.detailLabel}>Company:</Text>
		<Text style={styles.detailValue}>{user.company.name}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	detailsContainer: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff',
	},
	detailLabel: {
		fontWeight: 'bold',
		marginTop: 16,
		fontSize: 16,
	},
	detailValue: {
		marginLeft: 8,
		fontSize: 14,
		color: '#444',
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
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		color: 'red',
		fontSize: 16,
		fontWeight: 'bold',
	},
	errorUser: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold' as 'bold',
		color: '#c0392b',
		backgroundColor: '#fdecea',
		padding: 16,
		borderRadius: 8,
		marginHorizontal: 20,
		borderWidth: 1,
		borderColor: '#eb998f',
		fontStyle: 'italic' as 'italic',
		marginTop: 40,
	}
});