import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {getRecipe, getRecipeRating, rateRecipe} from '@/services/api';
import Navbar from '@/components/navbar';
import {Recipe} from '@/types/recipe';
import StarRating from '@/components/starRating';
import {jwtDecode} from "jwt-decode";

export default function RecipePage() {
    const router = useRouter();
    const {id} = router.query;
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [userRating, setUserRating] = useState<number>(0);
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!token) {
            setUserId(null);
            setIsLoggedIn(false);
            return;
        }

        try {
            const payload: { sub: number } = jwtDecode(token);
            setUserId(payload.sub);
            setIsLoggedIn(true);
        } catch (err) {
            console.error('Failed to decode JWT', err);
            setUserId(null);
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        if (!id) return;

        const effectiveUserId = userId || 1;

        getRecipe(effectiveUserId, Number(id)).then(recipeData => {
            setRecipe(recipeData);

            if (isLoggedIn && userId) {
                const existingRating = recipeData.ratings?.find((r: {
                    userId: number;
                    value: number
                }) => r.userId === userId);
                setUserRating(existingRating?.value ?? 0);
            }
        });
    }, [id, userId, isLoggedIn]);

    if (!recipe) return <p>Loading...</p>;

    const handleRate = async (rating: number) => {
        if (!isLoggedIn) {
            alert('Please log in to rate recipes');
            return;
        }

        if (!id || !userId) return;
        setUserRating(rating);

        const rateResult = await rateRecipe(userId, Number(id), rating);

        if (rateResult) {
            const ratingData = await getRecipeRating(Number(id));
            setRecipe(prev => prev ? {
                ...prev,
                averageRating: ratingData.average,
                totalRatings: ratingData.count
            } : prev);
        }
    };

    return (

        <div className='min-h-screen bg-gray-50'>
            <Navbar/>

            <div className='max-w-4xl mx-auto py-8 px-4'>
            {/*    header*/}
            <div className='bg-white rounded-xl shadow-lg p-8 mb-6'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600 mb-5'>{recipe.title} </h1>
                        <p className='text-gray-600 flex items-center'>
                            <span className='bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium'>
                              {recipe.author.name}

                            </span>

                        </p>
                        <span className='text-gray-500 mt-5'>
                                {new Date(recipe.createdAt).toLocaleDateString('ua-UA')}
                            </span>
                    </div>
                    <div className='mt-4 md:mt-0 text-center'>

                    </div>
                </div>

            </div>



            <div className='grid md:grid-cols-3 gap-6'>
                {/*    Ingredients */}
                <div className='md:col-span-1'>
                    <div className='bg-white rounded-xl shadow-lg p-6 sticky top-6'>
                        <div className='flex items-center mb-4'>
                            <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3'>
                                <span className='text-orange-600'> 🥄</span>

                            </div>
                            <h2 className='text-xl font-bold text-gray-800'> Ingredients</h2>
                        </div>
                        <div className='bg-gray-50 rounded-lg p-4'>
                            <div className='whitespace-pre-line text-gray-700 leading-relaxed'>
                                {recipe.ingredients}
                            </div>
                        </div>
                    </div>
                </div>
                {/*Instruction*/}
                <div className='md:col-span-2'>
                    <div className='bg-white rounded-xl shadow-lg p-6'>
                        <div className='flex items-center mb-6'>
                            <div className='w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3'>
                                <span className='text-orange-100'> 📝 </span>
                            </div>
                            <h2 className='text-xl font-bold text-gray-800'>Recipe</h2>
                        </div>
                        <div className=' max-w-none'>
                            <div className='text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-6'>
                                {recipe.instructions}
                            </div>
                        </div>
                    </div>
                </div>
                {/* rating */}
                <div className="border-t pt-6">
                    <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-700">Your rating:</span>
                        {isLoggedIn ? (
                            <StarRating rating={userRating} onRate={handleRate}/>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <StarRating rating={0} readOnly/>
                                <span className="text-sm text-gray-500">
                                        Login to rate a recipe
                                    </span>
                            </div>
                        )}
                    </div>
                </div>
                {/* back button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.back()}
                        className=" cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
}