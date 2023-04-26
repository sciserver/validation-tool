import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.interface';
import { ValidationGenericMetadataDto } from './review.interface';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getReviewItens(
    @Req() req,
    @Query('page_size') page_size,
    @Query('page_number') page_number,
    @Query('do_show_reviewed_items') do_show_reviewed_items,
  ) {
    if (!page_size) {
      page_size = 10;
    }
    if (!page_number) {
      page_number = 0;
    }
    const user: User = req.user;
    if (do_show_reviewed_items == '1') {
      do_show_reviewed_items = true;
    } else {
      do_show_reviewed_items = false;
    }
    return await this.reviewService.getReviewItems(
      user.id,
      page_size,
      page_number,
      do_show_reviewed_items,
    );
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  async getReviewItensCount(
    @Req() req,
    @Query('do_show_reviewed_items') do_show_reviewed_items,
  ) {
    const user: User = req.user;
    if (do_show_reviewed_items == '1') {
      do_show_reviewed_items = true;
    } else {
      do_show_reviewed_items = false;
    }
    const result = await this.reviewService.getReviewItensCount(
      user.id,
      do_show_reviewed_items,
    );
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
    await this.reviewService.reviewDatasetMentionParentAlias(user.id, body);
    return true;
  }

  @Get('/progress/:run_id')
  @UseGuards(JwtAuthGuard)
  async getReviewProgress(@Param('run_id') runId, @Req() req) {
    const user: any = req.user;

    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);
    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.reviewService.getProgress(Number.parseInt(runId));
    }
    return { status: 403 }
  }

  @Get('/statistics/:run_id')
  @UseGuards(JwtAuthGuard)
  async getStatistics(@Param('run_id') runId, @Req() req) {
    const user: any = req.user;

    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);
    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.reviewService.getStatistics(Number.parseInt(runId));
    }
    throw new Error("User doesn't have access to this data");
  }
}
