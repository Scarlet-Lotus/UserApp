// app/navigation/ApiNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing screens from the screens folder
import UserListScreen from '../screens/UserListScreen';
import UserDetailsScreen from '../details/[id]';

// Defining the types of routes
export type RootStackParamList = {
	UserList: undefined;
	UserDetails: { userId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Navigator component
export default function ApiNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="UserList">
				<Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'Users' }} />
				<Stack.Screen name="UserDetails" component={UserDetailsScreen} options={{ title: 'User Details' }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}