import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { searchRecipes } from '@/services/api';

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const searchQuery = router.query.q as string;
        if (searchQuery) {
            setQuery(searchQuery);
            performSearch(searchQuery);
        }
    }, [router.query.q]);

    const performSearch = async (searchQuery: string) => {
        setLoading(true);
        try {
            const data = await searchRecipes(searchQuery);
            setResults(data);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Результаты поиска</h1>
                <p className="text-gray-600">
                    {query && `По запросу "${query}"`}
                </p>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Поиск...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Ничего не найдено</p>
                    <Link href="/">
                        <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                            Вернуться к рецептам
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((recipe: any) => (
                        <div key={recipe.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
                            <p className="text-gray-600 mb-2">by {recipe.author.name}</p>

                            <div className="flex items-center mb-3">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1">{recipe.averageRating || '0.0'}</span>
                                <span className="ml-1 text-gray-500">({recipe.totalRatings || 0} оценок)</span>
                            </div>

                            {recipe.ingredients && (
                                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                                    Ингредиенты: {recipe.ingredients.substring(0, 100)}...
                                </p>
                            )}

                            <Link href={`/recipe/${recipe.id}`}>
                                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full">
                                    Посмотреть рецепт
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}