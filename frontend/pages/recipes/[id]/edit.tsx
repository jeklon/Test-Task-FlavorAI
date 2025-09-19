import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import RecipeForm from '@/components/recipeForm';
import { getRecipeForEdit, updateRecipe } from '@/services/api';
import { Recipe } from '@/types/recipe';
import { useUserId } from '@/hooks/useUserId';

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = router.query;

  const userId = useUserId();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id || userId === null) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getRecipeForEdit(userId!, Number(id));
        setRecipe(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipe for edit');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, userId]);

  const handleSubmit = async (data: { title: string; ingredients?: string; instructions: string }) => {
    if (!userId || !id) return;
    try {
      setSubmitting(true);
      await updateRecipe(userId, Number(id), data);
      router.push('/my-recipes');
    } catch (err) {
      console.error(err);
      setError('Failed to update recipe');
    } finally {
      setSubmitting(false);
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
            <span className="text-neutral-300">Edit</span>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Edit Recipe</h1>
          <p className="mt-1 text-sm text-neutral-300/90">
            Update title, ingredients or instructions. Changes will appear in “My Recipes”.
          </p>
        </div>

        {userId === null && !loading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
            <div className="rounded-[1rem] bg-neutral-950/60 p-6 text-neutral-200">
              You must be logged in.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-0.5">
            <div className="rounded-[1rem] bg-neutral-950/60 p-4 text-red-300">
              {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="h-6 w-1/3 rounded bg-white/10" />
              <div className="mt-3 h-4 w-2/3 rounded bg-white/10" />
            </div>
            <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-10 h-64" />
          </div>
        )}

        {!loading && userId !== null && recipe && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
            <div className="rounded-[1rem] bg-neutral-950/60 p-5 sm:p-6">
              <RecipeForm
                initialData={recipe}
                onSubmit={handleSubmit}
                submitButton={
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium
                               bg-gradient-to-r from-emerald-500 via-cyan-500 to-fuchsia-500 text-white
                               hover:shadow-[0_8px_30px_rgba(56,189,248,0.35)] active:scale-[0.98] transition
                               disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                }
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}