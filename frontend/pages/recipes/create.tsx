import { useRouter } from 'next/router';
import Navbar from '@/components/navbar';
import RecipeForm from '@/components/recipeForm';
import { createRecipe } from '@/services/api';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { useState } from 'react';

export default function CreateRecipePage() {
  const router = useRouter();
  const { userId } = useUserRecipes();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: { title: string; ingredients?: string; instructions: string }) => {
    if (!userId) {
      alert('You must be logged in');
      return;
    }
    try {
      setSubmitting(true);
      await createRecipe(userId, data);
      router.push('/my-recipes');
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
            <span className="text-neutral-300">Create</span>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Create Recipe</h1>
          <p className="mt-1 text-sm text-neutral-300/90">
            Add title, ingredients and step-by-step instructions. You can edit it later from “My Recipes”.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-0.5">
          <div className="rounded-[1rem] bg-neutral-950/60 p-5 sm:p-6">
            <RecipeForm
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
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                      </svg>
                      Create
                    </>
                  )}
                </button>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}