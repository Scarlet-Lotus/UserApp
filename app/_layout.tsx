// app/_layout.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { RootLayoutNav } from './RootLayoutNav';

export default function RootLayout() {
	return (
		<Provider store={store}>
			<RootLayoutNav />
		</Provider>
	);
}
