import { useState, FormEvent } from 'react';
import { Recipe } from '@/types/recipe';

type RecipeFormProps = {
    initialData?: Partial<Recipe>;
    onSubmit: (data: { title: string; ingredients?: string; instructions: string }) => void;
};

export default function RecipeForm({ initialData, onSubmit }: RecipeFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [ingredients, setIngredients] = useState(initialData?.ingredients || '');
    const [instructions, setInstructions] = useState(initialData?.instructions || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title || !instructions) return alert('Title and instructions are required');
        onSubmit({ title, ingredients, instructions });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-4">
            <div>
                <label className="block mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Ingredients</label>
                <textarea
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div>
                <label className="block mb-1">Instructions</label>
                <textarea
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                {initialData ? 'Update Recipe' : 'Create Recipe'}
            </button>
        </form>
    );
}
