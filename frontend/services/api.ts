const BASE_URL = 'http://localhost:3000/flavors';

type RecipePayload = {
    title: string;
    ingredients?: string;
    instructions: string;
};

export async function getRecipes() {
    const res = await fetch(`${BASE_URL}`);
    return res.json();
}

export async function getRecipe(userId: number, id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: { 'x-user-id': String(userId) },
    });
    return res.json();
}
export async function getMyRecipes(userId: number) {
    const res = await fetch(`${BASE_URL}/my`, {
        headers: { 'x-user-id': String(userId) },
    });

    if (!res.ok) {
        console.error('Failed fetch', res.status, await res.text());
        return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function createRecipe(userId: number, data: RecipePayload) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': String(userId),
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateRecipe(userId: number, id: number, data: RecipePayload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': String(userId),
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteRecipe(userId: number, id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': String(userId) },
    });
    return res.json();
}
export async function rateRecipe(userId: number, recipeId: number, rating: number) {
    const res = await fetch(`${BASE_URL}/${recipeId}/rate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': String(userId),
        },
        body: JSON.stringify({ value: rating }),
    });

    if (!res.ok) {
        console.error('Failed to rate recipe', res.status, await res.text());
        return null;
    }

    return res.json();
}
export async function getRecipeRating(recipeId: number) {
    const res = await fetch(`http://localhost:3000/flavors/${recipeId}/rating`);
    return res.json();
}

export async function getRecipeForEdit(userId: number, recipeId: number) {
    const res = await fetch(`${BASE_URL}/${recipeId}/edit`, {
        headers: { 'x-user-id': String(userId) },
    });

    if (!res.ok) {
        throw new Error(`Failed to get recipe for edit: ${res.status}`);
    }

    return res.json();
}

export async function searchRecipes(query: string) {
    try {
        const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (!res.ok) {
            console.error('searchRecipes failed', res.status, await res.text());
            return [];
        }
        return await res.json();
    } catch (err) {
        console.error('searchRecipes error', err);
        return [];
    }
}