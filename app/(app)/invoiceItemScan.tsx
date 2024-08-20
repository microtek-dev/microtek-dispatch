import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, useTheme, Modal, Portal } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useNewScannedItems } from '../../store/useScannedItems';

const invoiceItemScan = () => {
	const [permission, requestPermission] = useCameraPermissions();
	const theme = useTheme();
	const router = useRouter();
	const { partcode, qty } = useLocalSearchParams();

	const [visible, setVisible] = useState(false);
	const [scannedData, setScannedData] = useState<string>();

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	// const scannedItems = useScannedItems((state) => state.scannedItems);
	// const addScannedItems = useScannedItems((state) => state.addScannedItems);

	const newScannedItems = useNewScannedItems((state) => state.scannedItems);
	const newAddScannedItems = useNewScannedItems((state) => state.addScannedItems);

	useEffect(() => {
		if (newScannedItems[partcode + '']?.length === Number(qty)) {
			setTimeout(() => router.back(), 1000);
		}
	}, [newScannedItems[partcode + '']?.length]);

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
		<>
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
						// addScannedItems(data);
						showModal();
						setScannedData(data);
						newAddScannedItems(data, partcode + '');
					}}
				/>

				<View style={styles.remainingItems}>
					<Text
						style={{ color: theme.colors.secondary }}
						variant="headlineLarge">
						Items Remaining
					</Text>

					<Text style={{ color: theme.colors.tertiary, fontSize: 150, paddingBottom: 50 }}>
						{isNaN(Number(qty) - newScannedItems[partcode + '']?.length) ? Number(qty) : Number(qty) - newScannedItems[partcode + '']?.length}
					</Text>
				</View>

				<Portal>
					<Modal
						visible={visible}
						onDismiss={hideModal}
						contentContainerStyle={styles.modalContainerStyle}>
						<Text
							style={{ color: theme.colors.primary, marginBottom: 25 }}
							variant="titleMedium">
							Scanned Info
						</Text>

						<Text style={{ color: theme.colors.secondary }}>{scannedData}</Text>
					</Modal>
				</Portal>
			</Container>
		</>
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
		height: '40%',
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
	modalContainerStyle: {
		backgroundColor: 'white',
		padding: 10,
		margin: 20,
		borderRadius: 20,
	},
});

export default invoiceItemScan;
