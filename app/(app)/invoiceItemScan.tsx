import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import Container from '../../components/Container';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Button, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useScannedItems } from '../../store/useScannedItems';

const invoiceItemScan = () => {
	const [permission, requestPermission] = useCameraPermissions();
	const theme = useTheme();
	const { partcode, qty } = useLocalSearchParams();

	const scannedItems = useScannedItems((state) => state.scannedItems);
	const addScannedItems = useScannedItems((state) => state.addScannedItems);

	console.log(scannedItems);

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<Container>
				<Stack.Screen
					options={{
						headerShown: false,
					}}
				/>
				<Text style={styles.message}>We need your permission to show the camera</Text>
				<Button
					mode="outlined"
					style={{ width: '100%', marginTop: 15, borderColor: theme.colors.primary, backgroundColor: theme.colors.primary }}
					onPress={requestPermission}>
					<Text style={{ color: '#FFF' }}>Grant Permission</Text>
				</Button>
			</Container>
		);
	}

	return (
		<Container>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>

			<Text
				style={{ color: theme.colors.primary, marginBottom: 25 }}
				variant="titleLarge">
				Scan Invoice Items
			</Text>

			<CameraView
				barcodeScannerSettings={{
					barcodeTypes: ['qr'],
				}}
				autofocus="on"
				style={styles.camera}
				onBarcodeScanned={({ data }) => {
					addScannedItems(data);
				}}
			/>

			<View style={styles.remainingItems}>
				<Text
					style={{ color: theme.colors.secondary }}
					variant="headlineLarge">
					Items Remaining
				</Text>

				<Text style={{ color: theme.colors.tertiary, fontSize: 150, paddingBottom: 50 }}>{Number(qty) - scannedItems.length}</Text>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
	camera: {
		height: '60%',
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'transparent',
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: 'flex-end',
		alignItems: 'center',
	},
	text: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
	},
	remainingItems: {
		padding: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default invoiceItemScan;
