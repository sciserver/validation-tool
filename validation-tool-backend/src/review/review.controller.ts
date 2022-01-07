import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.interface';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getReviewItens(@Req() req) {
    const user: User = req.user;
    return await this.reviewService.getReviewItens(user.source_id);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  async getReviewItensCount(@Req() req) {
    const user: User = req.user;
    const review_items = await this.reviewService.getReviewItens(
      user.source_id,
    );
    return { count: review_items.length };
  }
}
