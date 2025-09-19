import RecipeCard from '../components/recipeCard';
import Navbar from '../components/navbar';
import { useEffect, useMemo, useState } from 'react';
import { getRecipes } from '@/services/api';
import { Recipe } from '@/types/recipe';
import { useRouter } from 'next/router';
import { useUserId } from '@/hooks/useUserId';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const userId = useUserId();

  const handleCreate = () => {
    if (userId) router.push('/recipes/create');
    else router.push('/auth/signup');
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRecipes();
        if (mounted) setRecipes(data ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter((r) => r.title?.toLowerCase().includes(q));
  }, [recipes, query]);

  const hasRecipes = filtered.length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-400/20 via-cyan-500/10 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-emerald-500/10 via-emerald-400/5 to-transparent blur-2xl" />
      </div>

      <Navbar
        searchValue={query}
        onSearchChange={setQuery}
        onCreate={handleCreate}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">Discover Recipes</h1>
          <p className="text-sm text-neutral-300/80">
            Explore community creations or add your own delicacy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="h-40 rounded-xl bg-white/10" />
                <div className="mt-4 h-5 w-2/3 rounded bg-white/10" />
                <div className="mt-2 h-4 w-1/3 rounded bg-white/10" />
              </div>
            ))}

          {!loading && hasRecipes &&
            filtered.map((recipe) => (
              <div
                key={recipe.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/recipes/${recipe.id}`)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && router.push(`/recipes/${recipe.id}`)}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-0.5
                           transition-all hover:border-emerald-400/30 hover:bg-white/[0.06] focus:outline-none
                           focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 via-cyan-400/0 to-fuchsia-500/0 opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
                <div className="relative rounded-[1rem] bg-neutral-950/60 p-4 sm:p-5">
                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    averageRating={recipe.averageRating}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="tabular-nums">{(recipe.averageRating ?? 0).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="hidden sm:inline">Open</span>
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {!loading && !hasRecipes && (
            <div className="col-span-full">
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                <h3 className="text-lg font-medium">No recipes yet</h3>
                <p className="mt-1 text-neutral-300/80">
                  Start by creating your first recipe — inspire the community!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}