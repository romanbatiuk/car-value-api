import { IsNumber, IsString, Min, Max, IsLongitude, IsLatitude } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimatetDto {
	@IsString()
	make: string;

	@IsString()
	model: string;

	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	@Min(1930)
	@Max(2050)
	year: number;

	@Transform(({ value }) => parseInt(value))
	@IsLongitude()
	lng: number;

	@Transform(({ value }) => parseInt(value))
	@IsLatitude()
	lat: number;

	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;
}
