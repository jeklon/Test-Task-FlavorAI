import { useRouter } from 'next/router';

export function useAuth() {
    const router = useRouter();

    const authenticate = async (
        url: string,
        data: Record<string, any>
    ) => {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (!res.ok) {
                const errorMessage = json.message || `Error ${res.status}`;
                alert(errorMessage);
                return;
            }

            localStorage.setItem('token', json.access_token);
            router.push('/');
        } catch (err) {
            console.error('Authentication error:', err);
            throw err;
        }
    };

    const signin = (data: { email: string; password: string }) =>
        authenticate('http://localhost:3000/auth/login', data);

    const signup = (data: { email: string; password: string; name?: string }) =>
        authenticate('http://localhost:3000/auth/register', data);

    return { signin, signup };
}
