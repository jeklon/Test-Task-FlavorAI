import { useState } from 'react';

type Props = {
    rating: number;
    onRate?: (rating: number) => void;
    readOnly?: boolean;
};

export default function StarRating({ rating, onRate, readOnly = false }: Props) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    onClick={() => !readOnly && onRate?.(star)}
                    className={`w-6 h-6 cursor-pointer ${
                        star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.179c.969 0 1.371 1.24.588 1.81l-3.384 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.384-2.455a1 1 0 00-1.176 0l-3.384 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.046 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.951-.69l1.285-3.974z" />
                </svg>
            ))}
        </div>
    );
}
