import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 *
 * - If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.
 * - If you want a type meaning "any value", you probably want `unknown` instead.
 * - If you want a type meaning "empty object", you probably want `Record<string, never>` instead
 *
 */

interface ClassConstructor {
	new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: any) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		//* Run something before a request is handled by the request handler
		// console.log(' before a request is handled', context);

		return next.handle().pipe(
			map((data: any) => {
				//* Run something before the response is sent out
				// console.log('Run something before the response is sent out', data);
				return plainToClass(this.dto, data, { excludeExtraneousValues: true });
			}),
		);
	}
}
