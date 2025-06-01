// app/RootLayoutNav.tsx
import React from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	if (!loaded) return null;

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="details/[id]" options={{ title: 'Details' }} />
				<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
			</Stack>
		</ThemeProvider>
	);
}