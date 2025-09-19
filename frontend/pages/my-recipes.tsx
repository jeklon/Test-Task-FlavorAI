import Navbar from '@/components/navbar';
import RecipeCard from '@/components/recipeCard';
import { deleteRecipe } from '@/services/api';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function MyRecipes() {
  const router = useRouter();
  const { userId, recipes, setRecipes } = useUserRecipes();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!userId) return;
    try {
      setDeletingId(id);
      await deleteRecipe(userId, id);
      setRecipes((prev) => prev?.filter((r) => r.id !== id) ?? []);
    } catch (err) {
      console.error('Failed to delete recipe', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[56rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-400/20 via-cyan-500/10 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-emerald-500/10 via-emerald-400/5 to-transparent blur-2xl" />
      </div>

      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8">
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
            <span className="text-neutral-300">My Recipes</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">My Recipes</h1>
          <p className="mt-1 text-sm text-neutral-300/90">
            Manage your creations — edit or delete as needed.
          </p>
        </div>

        {userId === null && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
            <div className="rounded-[1rem] bg-neutral-950/60 p-6 text-neutral-200">
              Please log in to see your recipes.
            </div>
          </div>
        )}

        {recipes === null && (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="h-40 rounded-xl bg-white/10" />
                <div className="mt-4 h-5 w-2/3 rounded bg-white/10" />
                <div className="mt-2 h-4 w-1/3 rounded bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {recipes?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
            <h3 className="text-lg font-medium">You have not created any recipes yet.</h3>
            <p className="mt-1 text-neutral-300/80">
              Click <span className="font-medium">Create Recipe</span> in the header to add your first one.
            </p>
          </div>
        )}

        {recipes && recipes.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
                <div className="rounded-[1rem] bg-neutral-950/60 p-4 sm:p-5">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') && router.push(`/recipes/${recipe.id}`)
                    }
                    className="focus:outline-none"
                  >
                    <RecipeCard id={recipe.id} title={recipe.title} />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm
                                 text-white hover:bg-white/15 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      disabled={deletingId === recipe.id}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                                 text-red-200 bg-red-500/10 hover:bg-red-500/15 transition
                                 disabled:opacity-60 disabled:pointer-events-none"
                    >
                      {deletingId === recipe.id ? 'Deleting…' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}