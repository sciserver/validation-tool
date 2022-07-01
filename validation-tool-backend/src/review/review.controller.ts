import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.interface';
import { ValidationGenericMetadataDto } from './review.interface';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getReviewItens(
    @Req() req,
    @Query('page_size') page_size,
    @Query('page_number') page_number,
  ) {
    if (!page_size) {
      page_size = 10;
    }
    if (!page_number) {
      page_number = 0;
    }
    const user: User = req.user;
    return await this.reviewService.getReviewItems(
      user.id,
      page_size,
      page_number,
    );
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  async getReviewItensCount(@Req() req) {
    const user: User = req.user;
    const result = await this.reviewService.getReviewItensCount(user.id);
    return result;
  }

  @Post('/generic_metadata')
  @UseGuards(JwtAuthGuard)
  async reviewDatasetMentionAlias(
    @Req() req,
    @Body() body: ValidationGenericMetadataDto,
  ) {
    const user: User = req.user;
    await this.reviewService.reviewDatasetMentionAlias(user.id, body);
    return true;
  }

  @Post('/publication_dataset_alias')
  @UseGuards(JwtAuthGuard)
  async reviewDatasetMentionParentAlias(
    @Req() req,
    @Body() body: ValidationGenericMetadataDto,
  ) {
    const user: User = req.user;
    await this.reviewService.reviewDatasetMentionParentAlias(
      user.id,
      body,
    );
    return true;
  }
}
