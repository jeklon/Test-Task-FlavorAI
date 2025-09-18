import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { Recipe } from '@/types/recipe';
import { getMyRecipes } from '@/services/api';

export function useUserRecipes() {
    const [userId, setUserId] = useState<number | null>(null);
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!token) {
            setUserId(null);
            setRecipes([]);
            return;
        }

        try {
            const payload: { sub: number } = jwtDecode(token);
            setUserId(payload.sub);

            getMyRecipes(payload.sub)
                .then(res => setRecipes(Array.isArray(res) ? res : []))
                .catch(err => {
                    console.error('Failed to fetch recipes', err);
                    setRecipes([]);
                });
        } catch (err) {
            console.error('Failed to decode JWT', err);
            setUserId(null);
            setRecipes([]);
        }
    }, []);

    return { userId, recipes, setRecipes };
}
