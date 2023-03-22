import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@Controller(['admin', 'admin/dashboard'])
@Roles(Role.ADMIN, Role.SYSADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}
  
  @Get('/datasets') // Query: Dataset Names and Aliases
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDatasetNamesAndAliases(@Req() req) {
    const user: any = req.user;
    const run_ids = user?.privileges.map((x) => x.run_id);
    const result = await this.adminService.getDatasetNamesAndAliases(run_ids);
    return result;
  }

  @Get('/datasets/statistics') // Query: Dataset Reviews Statistics
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDatasetStatistics(@Req() req) {
    const user: any = req.user;
    const run_ids = user?.privileges.map((x) => x.run_id);
    const result = await this.adminService.getDatasetStatistics(run_ids);
    return result;
  }

  @Get('/datasets/ml_models/statistics') // Query: ML Models statistics
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMachineLearningModelStatistics(@Req() req) {
    const user: any = req.user;
    const run_ids = user?.privileges.map((x) => x.run_id);
    const result = await this.adminService.getMachineLearningModelStatistics(run_ids);
    return result;
  }

  @Get('/topics/publication_count') // Query: Num Publications per Topic
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getTotalPublicationsPerTopic(@Req() req) {
    const user: any = req.user;
    const run_ids = user?.privileges.map((x) => x.run_id);
    const result = await this.adminService.getTotalPublicationsPerTopic(run_ids);
    return result;
  }

  @Get('/reviewers') // Query: Reviewers & Admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getReviewers(@Req() req) {
    const user: any = req.user;
    const run_ids = user?.privileges.map((x) => x.run_id);
    const result = await this.adminService.getReviewers(run_ids);
    return result;
  }
}
