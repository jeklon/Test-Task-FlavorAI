import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';
import RecipeForm from '../../components/recipeForm';
import {createRecipe, getMyRecipes} from '@/services/api';
import { useUserRecipes } from '@/hooks/useUserRecipes';

export default function CreateRecipePage() {
    const router = useRouter();
    const { userId, recipes, setRecipes } = useUserRecipes();

    const handleSubmit = async (data: { title: string; ingredients?: string; instructions: string }) => {
        if (!userId) return alert('You must be logged in');
        await createRecipe(userId, data);
        router.push('/my-recipes');
    };

    return (
        <div>
            <Navbar />
            <h1 className="text-2xl font-bold p-4">Create Recipe</h1>
            <RecipeForm onSubmit={handleSubmit} />
        </div>
    );
}
