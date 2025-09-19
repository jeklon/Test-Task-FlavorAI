import Link from 'next/link';
import StarRating from './starRating';
import React from 'react';

type RecipeCardProps = {
  id: number;
  title: string;
  averageRating?: number;
  imageUrl?: string | null;
};

export default function RecipeCard({
  id,
  title,
  averageRating = 0,
  imageUrl,
}: RecipeCardProps) {
  return (
    <Link href={`/recipes/${id}`} className="block group">
      <div
        className="relative h-48 w-full overflow-hidden rounded-2xl
                   border border-white/10 bg-white/[0.04]
                   transition hover:shadow-[0_8px_30px_rgba(56,189,248,0.25)]"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
            <span className="text-4xl">🍲</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h2
            className="line-clamp-2 text-base font-semibold text-white/95 drop-shadow
                       transition-colors group-hover:text-emerald-300"
            title={title}
          >
            {title}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={averageRating} readOnly />
            <span className="text-xs text-neutral-300">{averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
