import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.interface';
import {
  ValidationGenericMetadataDto,
  ValidationPublicationDatasetAliasDto,
} from './review.interface';
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
    const count = await this.reviewService.getReviewItensCount(user.source_id);
    return { count: count };
  }

  @Post('/generic_metadata')
  @UseGuards(JwtAuthGuard)
  async reviewDatasetMentionAlias(
    @Req() req,
    @Body() body: ValidationGenericMetadataDto,
  ) {
    const user: User = req.user;
    await this.reviewService.reviewDatasetMentionAlias(user.source_id, body);
    return true;
  }

  @Post('/publication_dataset_alias')
  @UseGuards(JwtAuthGuard)
  async reviewDatasetMentionParentAlias(
    @Req() req,
    @Body() body: ValidationPublicationDatasetAliasDto,
  ) {
    const user: User = req.user;
    await this.reviewService.reviewDatasetMentionParentAlias(
      user.source_id,
      body,
    );
    return true;
  }
}
