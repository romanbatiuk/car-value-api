import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) {}
	create(reportDto: CreateReportDto, user: User) {
		const report = this.reportsRepository.create(reportDto);
		report.user = user;
		return this.reportsRepository.save(report);
	}

	async changeApproval(id: number, approved: boolean) {
		const report = await this.reportsRepository.findOne({ where: { id } });

		console.log(report);

		if (!report) {
			throw new NotFoundException('Report not found');
		}

		report.approved = approved;
		return this.reportsRepository.save(report);
	}
}
