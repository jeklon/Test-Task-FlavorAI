import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import RecipeForm from '../../../components/recipeForm';
import {getRecipeForEdit, updateRecipe} from '@/services/api';
import { Recipe } from '@/types/recipe';
import { useUserId } from '@/hooks/useUserId';

export default function EditRecipePage() {
    const router = useRouter();
    const { id } = router.query;
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [error, setError] = useState<string | null>(null);

    const userId = useUserId();

    useEffect(() => {
        if (!id || userId === null) return;

        async function fetchRecipe() {
            try {
                const data = await getRecipeForEdit(userId!, Number(id));
                setRecipe(data);
                setError(null);
            } catch (err) {
                console.error(err);

                 router.replace('/my-recipes');
            }
        }

        fetchRecipe();
    }, [id, userId]);

    const handleSubmit = async (data: { title: string; ingredients?: string; instructions: string }) => {
        if (!userId || !id) return;
        try {
            await updateRecipe(userId, Number(id), data);
            router.push('/my-recipes');
        } catch (err) {
            setError('Failed to update recipe');
        }
    };

    if (!userId) return <p className="p-4">You must be logged in</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;
    if (!recipe) return <p className="p-4">Loading...</p>;

    return (
        <div>
            <Navbar />
            <h1 className="text-2xl font-bold p-4">Edit Recipe</h1>
            <RecipeForm initialData={recipe} onSubmit={handleSubmit} />
        </div>
    );
}