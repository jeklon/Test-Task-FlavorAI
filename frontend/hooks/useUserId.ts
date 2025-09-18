import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

export function useUserId() {
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!token) {
            setUserId(null);
            return;
        }

        try {
            const payload: { sub: number } = jwtDecode(token);
            setUserId(payload.sub);
        } catch (err) {
            console.error('Failed to decode JWT', err);
            setUserId(null);
        }
    }, []);

    return userId;
}
