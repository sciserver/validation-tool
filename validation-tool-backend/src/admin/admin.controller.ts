import {
  Controller,
  Get,
  Param,
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
  constructor(private adminService: AdminService) { }

  @Get('/stepper/:runId') // Query: Dataset Names and Aliases
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStepperData(@Param('runId') runId, @Req() req) {
    const user: any = req.user;
    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);

    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.adminService.getStepperData(runId);
    }

    throw new Error("User doesn't have access to this data");
  }

  @Get('/datasets/:runId') // Query: Dataset Names and Aliases
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDatasetNamesAndAliases(@Param('runId') runId, @Req() req) {
    const user: any = req.user;

    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);

    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.adminService.getDatasetNamesAndAliases(runId);
    }
    throw new Error("User doesn't have access to this data");
  }

  @Get('/datasets/statistics/:runId') // Query: Dataset Reviews Statistics
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDatasetStatistics(@Param('runId') runId, @Req() req) {
    const user: any = req.user;
    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);
    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.adminService.getDatasetStatistics(Number.parseInt(runId));
    }
    throw new Error("User doesn't have access to this data");
  }

  @Get('/datasets/ml_models/statistics/:runId') // Query: ML Models statistics
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMachineLearningModelStatistics(@Param('runId') runId, @Req() req) {
    const user: any = req.user;
    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);
    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.adminService.getMachineLearningModelStatistics(runId);
    }
    throw new Error("User doesn't have access to this data");
  }

  @Get('/topics/publication_count/:runId') // Query: Num Publications per Topic
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getTotalPublicationsPerTopic(@Param('runId') runId, @Req() req) {
    const user: any = req.user;

    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);
    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.adminService.getTotalPublicationsPerTopic(runId);
    }
    throw new Error("User doesn't have access to this data");
  }

  @Get('/reviewers/:runId') // Query: Reviewers & Admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getReviewers(@Param('runId') runId, @Req() req) {
    const user: any = req.user;

    const agencyPrivilege = (user?.privileges as { run_id: string, roles: string[] }[]).find(p => p.run_id === runId);
    if (agencyPrivilege && agencyPrivilege.roles.includes('ADMIN')) {
      return await this.adminService.getReviewers(Number.parseInt(runId));
    }
    throw new Error("User doesn't have access to this data");
  }
}
