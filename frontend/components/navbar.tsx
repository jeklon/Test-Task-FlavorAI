import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { searchRecipes } from '@/services/api';

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim() && searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchRecipes(searchQuery);
          setSearchResults(results || []);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleRecipeSelect = (recipeId: number) => {
    router.push(`/recipes/${recipeId}`);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  const handleCreate = () => {
    if (token) router.push('/recipes/create');
    else router.push('/auth/signup');
  };

  return (
    <header className="
      sticky top-0 z-30 w-full border-b border-white/10
      bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50
    ">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold tracking-tight
                       text-white/90 hover:bg-white/5 transition"
          >
            FlavorAI
          </button>
          <div className="relative mx-auto w-full max-w-2xl">
            <input
              type="text"
              placeholder="Find a recipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              onBlur={handleSearchBlur}
              className="w-full rounded-2xl border border-white/10
                         bg-gradient-to-b from-white/[0.08] to-white/[0.03]
                         px-5 py-3 text-sm text-white placeholder:text-neutral-400
                         outline-none focus:ring-2 focus:ring-emerald-500/30
                         focus:border-emerald-400/40"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
              </div>
            )}
            {showResults && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur">
                  {searchResults.length > 0 ? (
                    <ul className="max-h-96 overflow-y-auto">
                      {searchResults.map((recipe: any) => (
                        <li
                          key={recipe.id}
                          onClick={() => handleRecipeSelect(recipe.id)}
                          className="cursor-pointer border-b border-white/5 p-3 last:border-b-0
                                     hover:bg-white/5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-medium text-white">{recipe.title}</h4>
                              {recipe?.author?.name && (
                                <p className="text-sm text-neutral-400">by {recipe.author.name}</p>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-neutral-300">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{recipe.averageRating || '0.0'}</span>
                              <span className="ml-1">({recipe.totalRatings || 0})</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 text-center text-sm text-neutral-400">
                      Nothing found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-2">
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
                         bg-gradient-to-r from-emerald-500 via-cyan-500 to-fuchsia-500 text-white
                         hover:shadow-[0_8px_30px_rgba(56,189,248,0.35)]
                         active:scale-[0.98] transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
              Create Recipe
            </button>
            {token && (
              <Link href="/my-recipes">
                <button className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white
                                   hover:bg-white/15 transition">
                  My Recipes
                </button>
              </Link>
            )}
            {token ? (
              <button
                className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white
                           hover:bg-white/15 transition"
                onClick={() => {
                  localStorage.removeItem('token');
                  setToken(null);
                  location.reload();
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/auth/signin">
                  <button className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white
                                     hover:bg-white/15 transition">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white
                                     hover:bg-white/15 transition">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}
