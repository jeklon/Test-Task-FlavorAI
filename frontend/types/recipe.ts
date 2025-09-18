export type Recipe = {
    id: number;
    title: string;
    ingredients?: string;
    instructions: string;
    author: {
        id: number;
        email: string;
        name: string | null;
    };
    createdAt: string;
    avgRating: number;
    averageRating:number;
};