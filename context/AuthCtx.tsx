import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '../hooks/useStorageState';

const AuthContext = createContext<{
	signIn: (payload: { username: string; password: string }) => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
}>({
	signIn: () => null,
	signOut: () => null,
	session: null,
	isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
	const value = useContext(AuthContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error('useSession must be wrapped in a <SessionProvider />');
		}
	}

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState('session');

	return (
		<AuthContext.Provider
			value={{
				signIn: async (payload: { username: string; password: string }) => {
					// Perform sign-in logic here
					const res = await fetch('https://microtek.tech/v1/api/mhere/login', {
						method: 'POST',
						body: JSON.stringify(payload),
						headers: {
							'Content-type': 'application/json',
						},
					});
					const data = await res.json();
					setSession(JSON.stringify({ empId: data.new_e_code, token: data.token }));
				},
				signOut: () => {
					setSession(null);
				},
				session,
				isLoading,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
