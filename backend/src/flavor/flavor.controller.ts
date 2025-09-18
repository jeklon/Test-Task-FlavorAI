import {
    Controller,
    Post,
    Body,
    Headers,
    BadRequestException,
    Patch,
    Param,
    Get,
    Delete,
    Req,
    Query
} from '@nestjs/common';
import { FlavorService } from './flavor.service';

@Controller('flavors')
export class FlavorController {
    constructor(private readonly flavorService: FlavorService) {}

    @Post()
    async create(
        @Headers('x-user-id') userIdHeader: string,
        @Body() body: { title: string; ingredients?: string; instructions: string },
    ) {
        const userId = Number(userIdHeader);
        if (!userId) throw new BadRequestException('Missing x-user-id header');

        return await this.flavorService.create(userId, body);
    }

    @Patch(':id')
    async update(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id') recipeId: string,
        @Body() body: { title?: string; ingredients?: string; instructions?: string },
    ) {
        const userId = Number(userIdHeader);
        if (!userId) throw new BadRequestException('Missing x-user-id header');

        return await this.flavorService.update(userId, Number(recipeId), body);
    }

    @Get()
    async getAll() {
        return this.flavorService.getAll();
    }

    @Get('search')
    async search(@Query('q') query: string) {
        if (!query || query.trim() === '') {
            return [];
        }
        return this.flavorService.searchRecipes(query);
    }

    @Get('my')
    async getMy(@Req() req) {
        const userId = Number(req.headers['x-user-id']);
        console.log('x-user-id header:', req.headers['x-user-id']);
        if (!userId) throw new BadRequestException('Missing userId');
        return this.flavorService.getUserRecipes(userId);
    }

    @Get(':id')
    async getOne(@Param('id') recipeId: string) {
        return this.flavorService.getOne(Number(recipeId));
    }

    @Delete(':id')
    async remove(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id') recipeId: string,
    ) {
        const userId = Number(userIdHeader);
        if (!userId) throw new BadRequestException('Missing x-user-id header');
        return await this.flavorService.remove(userId, Number(recipeId));
    }

    @Post(':id/rate')
    async rateRecipe(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id') recipeId: string,
        @Body() body: { value: number }
    ) {
        const userId = Number(userIdHeader);
        if (!userId) throw new BadRequestException('Missing userId');
        return this.flavorService.rateRecipe(userId, Number(recipeId), body.value);
    }

    @Get(':id/rating')
    async getRating(@Param('id') recipeId: string) {
        return this.flavorService.getAverageRating(Number(recipeId));
    }

    @Get(':id/edit')
    async getRecipeForEdit(
        @Headers('x-user-id') userIdHeader: string,
        @Param('id') recipeId: string,
    ) {
        const userId = Number(userIdHeader);
        if (!userId) throw new BadRequestException('Missing userId');

        return this.flavorService.getRecipeForEdit(userId, Number(recipeId));
    }
}