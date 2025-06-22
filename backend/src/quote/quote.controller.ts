import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuoteService } from './quote.service';

@Controller('quotes')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  // List quotes with filter, search, sort
  @Get()
  list(@Query('search') search?: string, @Query('author') author?: string, @Query('sort') sort?: string) {
    return this.quoteService.findAll({ search, author, sort });
  }

  // Get single quote
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const quote = await this.quoteService.findOne(id);
    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  // Create quote (Auth required)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Request() req) {
    return this.quoteService.create(body, req.user.userId);
  }

  // Update quote (Auth required, only if vote = 0)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req) {
    const canEdit = await this.quoteService.canEditOrDelete(id);
    if (!canEdit) throw new ForbiddenException('Cannot edit quote with votes');
    return this.quoteService.update(id, body, req.user.userId);
  }

  // Delete quote (Auth required, only if vote = 0)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const canDelete = await this.quoteService.canEditOrDelete(id);
    if (!canDelete) throw new ForbiddenException('Cannot delete quote with votes');
    return this.quoteService.delete(id, req.user.userId);
  }

  // Vote (Auth required, only once per user/quote)
  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  async vote(@Param('id') quoteId: string, @Request() req) {
    return this.quoteService.vote(req.user.userId, quoteId);
  }
}
