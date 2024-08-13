import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
	return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
	divider: {
		height: 1,
		backgroundColor: '#CED0CE', // Customize the color as needed
		marginVertical: 10, // Customize the vertical margin as needed
	},
});

export default Divider;
