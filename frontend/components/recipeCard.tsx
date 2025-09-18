import Link from 'next/link';
import StarRating from './starRating';

type Props = {
    id: number;
    title: string;
    averageRating?: number;
};

export default function RecipeCard({ id, title, averageRating = 0 }: Props) {
    return (
        <Link href={`/recipes/${id}`}>
            <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-xl transition">
                <h2 className="font-bold text-lg">{title}</h2>
                <div className="mt-2">
                    <StarRating rating={averageRating} readOnly  />
                </div>
            </div>
        </Link>
    );
}
