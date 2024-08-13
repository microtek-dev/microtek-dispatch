import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, useTheme } from 'react-native-paper';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInput = ({ errorText, ...props }: Props) => {
	const theme = useTheme();
	return (
		<View style={styles.container}>
			<Input
				style={styles.input}
				selectionColor={theme.colors.primary}
				underlineColor="transparent"
				mode="outlined"
				{...props}
			/>
			{errorText ? <Text style={styles.error}>{errorText}</Text> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginVertical: 12,
	},
	input: {
		backgroundColor: '#fff',
	},
	error: {
		fontSize: 14,
		color: '#f13a59',
		paddingHorizontal: 4,
		paddingTop: 4,
	},
});

export default memo(TextInput);
