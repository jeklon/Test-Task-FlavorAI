import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import RecipeCard from '@/components/recipeCard';
import { getMyRecipes, deleteRecipe } from '@/services/api';
import {router} from "next/client";
import { useUserRecipes } from '@/hooks/useUserRecipes';

export default function MyRecipes() {
    const { userId, recipes, setRecipes } = useUserRecipes();


    const handleDelete = async (id: number) => {
        if (!userId) return;
        try {
            await deleteRecipe(userId, id);
            setRecipes(prev => prev?.filter(r => r.id !== id) ?? []);
        } catch (err) {
            console.error('Failed to delete recipe', err);
        }
    };


    if (!userId) return <p className="p-4">Please log in to see your recipes</p>;

    if (recipes === null) return <p className="p-4">Loading...</p>;

    if (recipes.length === 0)
        return (
            <div>
                <Navbar />
                <p className="p-4">You have not created any recipes yet.</p>
            </div>
        );

    return (
        <div>
            <Navbar />
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map(recipe => (
                    <div key={recipe.id}>
                        <RecipeCard id={recipe.id} title={recipe.title} />
                        <div className="mt-2 flex gap-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded"     onClick={() => router.push(`/recipes/${recipe.id}/edit`)}>Edit</button>
                            <button
                                onClick={() => handleDelete(recipe.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
