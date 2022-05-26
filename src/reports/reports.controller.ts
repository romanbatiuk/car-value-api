import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimatetDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Post()
	@UseGuards(AuthGuard)
	@Serialize(ReportDto)
	createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
		return this.reportsService.create(body, user);
	}

	@Patch('/:id')
	@UseGuards(AdminGuard)
	approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
		return this.reportsService.changeApproval(id, body.approved);
	}

	@Get()
	getEstimate(@Query() query: GetEstimatetDto) {
		return this.reportsService.createEstimate(query);
	}
}
