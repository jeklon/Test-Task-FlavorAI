import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getRecipe, getRecipeRating, rateRecipe } from '@/services/api';
import Navbar from '@/components/navbar';
import { Recipe } from '@/types/recipe';
import StarRating from '@/components/starRating';
import { jwtDecode } from 'jwt-decode';

export default function RecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
      setUserId(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const effectiveUserId = userId || 1;
    (async () => {
      setLoading(true);
      try {
        const recipeData = await getRecipe(effectiveUserId, Number(id));
        setRecipe(recipeData);
        if (isLoggedIn && userId) {
          const existingRating = recipeData.ratings?.find(
            (r: { userId: number; value: number }) => r.userId === userId
          );
          setUserRating(existingRating?.value ?? 0);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, userId, isLoggedIn]);

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
      setRecipe((prev) =>
        prev
          ? {
              ...prev,
              averageRating: ratingData.average,
              totalRatings: ratingData.count,
            }
          : prev
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-400/20 via-cyan-500/10 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-emerald-500/10 via-emerald-400/5 to-transparent blur-2xl" />
      </div>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <button
              onClick={() => router.back()}
              className="rounded-lg bg-white/5 px-2.5 py-1.5 hover:bg-white/10 transition"
            >
              ← Back
            </button>
            <span className="h-3 w-px bg-white/10" />
            <span>Recipes</span>
            <span>·</span>
            <span className="text-neutral-300">Details</span>
          </div>
        </div>
        {loading || !recipe ? (
          <div className="space-y-6">
            <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="h-6 w-2/3 rounded bg-white/10" />
              <div className="mt-3 h-4 w-1/3 rounded bg-white/10" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 md:col-span-1 h-60" />
              <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 md:col-span-2 h-60" />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-0.5 mb-6">
              <div className="rounded-[1rem] bg-neutral-950/60 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{recipe.title}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300/90">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {recipe.author?.name}
                      </span>
                      <span className="text-neutral-400">
                        {new Date(recipe.createdAt).toLocaleDateString('ua-UA')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-neutral-300">
                        <span className="text-yellow-400">★</span>
                        {(recipe.averageRating ?? 0).toFixed(1)}{' '}
                        <span className="text-neutral-400">({recipe.totalRatings ?? 0})</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <aside className="md:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
                  <div className="rounded-[1rem] bg-neutral-950/60 p-6">
                    <div className="mb-4 flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                        <span>🥄</span>
                      </div>
                      <h2 className="text-lg font-semibold">Ingredients</h2>
                    </div>
                    <div className="rounded-lg bg-white/5 p-4">
                      <div className="whitespace-pre-line leading-relaxed text-neutral-200/90">
                        {recipe.ingredients}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
              <section className="md:col-span-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
                  <div className="rounded-[1rem] bg-neutral-950/60 p-6">
                    <div className="mb-4 flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                        <span>📝</span>
                      </div>
                      <h2 className="text-lg font-semibold">Recipe</h2>
                    </div>
                    <div className="rounded-lg bg-white/5 p-6">
                      <div className="max-w-none whitespace-pre-line leading-relaxed text-neutral-200/90">
                        {recipe.instructions}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
                  <div className="rounded-[1rem] bg-neutral-950/60 p-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-base font-medium text-neutral-200">Your rating:</span>
                      {isLoggedIn ? (
                        <StarRating rating={userRating} onRate={handleRate} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <StarRating rating={0} readOnly />
                          <span className="text-sm text-neutral-400">Login to rate a recipe</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => router.back()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium
                               bg-gradient-to-r from-emerald-500 via-cyan-500 to-fuchsia-500 text-white
                               hover:shadow-[0_8px_30px_rgba(56,189,248,0.35)] active:scale-[0.98] transition"
                  >
                    ← Go back
                  </button>
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}