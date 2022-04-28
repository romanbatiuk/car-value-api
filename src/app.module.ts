import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { CookieSessionModule } from 'nestjs-cookie-session';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		UsersModule,
		ReportsModule,
		CookieSessionModule.forRoot({
			session: { secret: 'keyboard cat' },
		}),

		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: 'sqlite',
					database: config.get<string>('DB_NAME'),
					synchronize: true,
					entities: [User, Report],
				};
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
