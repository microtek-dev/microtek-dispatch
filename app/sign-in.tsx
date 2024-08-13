import { useRouter } from 'expo-router';
import { Button, Text, useTheme } from 'react-native-paper';
import { Image } from 'react-native';
import TextInput from '../components/TextInput';
import { useState } from 'react';
import Background from '../components/Background';

import { router } from 'expo-router';
import { useSession } from '../context/AuthCtx';

export default function SignIn() {
	const theme = useTheme();
	const { signIn } = useSession();

	const [empId, setEmpId] = useState({ value: '', error: '' });
	const [password, setPassword] = useState({ value: '', error: '' });

	return (
		<Background>
			<Image
				source={require('../assets/image.png')}
				style={{
					width: '50%',
					height: '6%',
					marginBottom: 25,
					borderRadius: 5,
				}}
			/>
			<TextInput
				label="Employee ID"
				returnKeyType="next"
				value={empId.value}
				onChangeText={(text) => setEmpId({ value: text, error: '' })}
				error={!!empId.error}
				errorText={empId.error}
				keyboardType="numeric"
				textColor={theme.colors.primary}
			/>
			<TextInput
				label="Password"
				returnKeyType="done"
				value={password.value}
				onChangeText={(text) => setPassword({ value: text, error: '' })}
				error={!!empId.error}
				errorText={empId.error}
				textColor={theme.colors.primary}
				secureTextEntry
			/>

			<Button
				mode="outlined"
				onPress={async () => {
					if (!(empId.value && password.value)) return;

					await signIn({ username: empId.value, password: password.value });
					router.replace('/');
				}}
				style={{ width: '100%', marginTop: 15, borderColor: theme.colors.primary, backgroundColor: theme.colors.primary }}>
				<Text style={{ color: '#FFF' }}>Login</Text>
			</Button>
		</Background>
	);
}
