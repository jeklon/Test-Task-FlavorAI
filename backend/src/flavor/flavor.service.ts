import {BadRequestException, Injectable} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FlavorService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, payload: any) {
        return this.prisma.recipe.create({
            data: {
                title: payload.title,
                ingredients: payload.ingredients ?? '',
                instructions: payload.instructions,
                author: { connect: { id: userId } },
            },
            include: {
                author: { select: { id: true, email: true, name: true } },
            },
        });
    }
    async update(userId: number, recipeId: number, payload: any) {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id: recipeId },
        });

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        if (recipe.authorId !== userId) {
            throw new Error('You can only edit your own recipes');
        }

        return this.prisma.recipe.update({
            where: { id: recipeId },
            data: {
                title: payload.title ?? recipe.title,
                ingredients: payload.ingredients ?? recipe.ingredients,
                instructions: payload.instructions ?? recipe.instructions,
            },
            include: {
                author: { select: { id: true, email: true, name: true } },
            },
        });
    }
    async getAll() {
        const recipes = await this.prisma.recipe.findMany({
            include: {
                author: { select: { id: true, email: true, name: true } },
                ratings: {
                    select: { value: true }
                }
            },
        });

        const recipesWithRating = recipes.map(recipe => {
            const ratings = recipe.ratings;
            const averageRating = ratings.length > 0
                ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
                : 0;

            return {
                ...recipe,
                averageRating: Math.round(averageRating * 100) / 100,
                totalRatings: ratings.length,
                ratings: undefined
            };
        });

        return recipesWithRating;
    }

    async getOne(recipeId: number) {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id: recipeId },
            include: { author: { select: { id: true, email: true, name: true } } },
        });
        if (!recipe) throw new BadRequestException('Recipe not found');
        return recipe;
    }
    async remove(userId: number, recipeId: number) {
        const recipe = await this.prisma.recipe.findUnique({ where: { id: recipeId } });

        if (!recipe || recipe.authorId !== userId) {
            throw new BadRequestException('Recipe not found or access denied');
        }

        // Сначала удаляем все рейтинги, связанные с этим рецептом
        await this.prisma.rating.deleteMany({ where: { recipeId } });

        // Теперь можно удалить сам рецепт
        return this.prisma.recipe.delete({ where: { id: recipeId } });
    }
    async getUserRecipes(userId:number){
        return this.prisma.recipe.findMany({
            where: { authorId:userId },
            include: { author: { select: { id: true, email: true, name: true } } },
        })
    }
    async rateRecipe(userId: number, recipeId: number, value: number) {
        const existing = await this.prisma.rating.findUnique({
            where: {
                userId_recipeId: { userId, recipeId }
            }
        });

        if (existing) {
            await this.prisma.rating.update({
                where: { userId_recipeId: { userId, recipeId } },
                data: { value }
            });
        } else {
            await this.prisma.rating.create({
                data: {
                    recipeId,
                    userId,
                    value
                }
            });
        }

        const averageRating = await this.getAverageRating(recipeId);

        return {
            success: true,
            averageRating: averageRating.average,
            totalRatings: averageRating.count
        };
    }

    async getAverageRating(recipeId: number) {
        const result = await this.prisma.rating.aggregate({
            where: { recipeId },
            _avg: { value: true },
            _count: { value: true },
        });

        return {
            average: result._avg.value ?? 0,
            count: result._count.value,
        };
    }
    async getRecipeForEdit(userId: number, recipeId: number) {
        const recipe = await this.prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                author: { select: { id: true, email: true, name: true } }
            }
        });

        if (!recipe) {
            throw new BadRequestException('Recipe not found');
        }

        if (recipe.authorId !== userId) {
            throw new BadRequestException('You can only edit your own recipes');
        }

        return recipe;
    }
    async searchRecipes(query: string) {
        const recipes = await this.prisma.recipe.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        ingredients: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            include: {
                author: { select: { id: true, name: true, email: true } },
                ratings: {
                    select: { value: true }
                }
            },
        });

        const recipesWithRating = recipes.map(recipe => {
            const ratings = recipe.ratings;
            const averageRating = ratings.length > 0
                ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
                : 0;

            return {
                ...recipe,
                averageRating: Math.round(averageRating * 100) / 100,
                totalRatings: ratings.length,
                ratings: undefined
            };
        });

        return recipesWithRating;
    }

}
