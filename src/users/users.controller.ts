import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Session,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	//? Get the currently signed in user
	@Get('current-user')
	getUser(@CurrentUser() user: User) {
		return user;
	}
	// getUser(@Session() session: { userId?: number }) {
	// 	return this.usersService.findOne(session.userId);
	// }

	@Post('signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: { userId?: number }) {
		const user = await this.authService.signup(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	@Post('signin')
	async signin(@Body() body: CreateUserDto, @Session() session: { userId?: number }) {
		const user = await this.authService.signin(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	@Post('signout')
	async signout(@Session() session: { userId?: number }) {
		session.userId = null;
	}

	@Patch(':id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(parseInt(id), body);
	}

	@Get(':id')
	async findUser(@Param('id') id: string) {
		// console.log('HANDLER IS RUNNING');

		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Get()
	findAllUsers(@Query('email') email: string) {
		return this.usersService.find(email);
	}

	@Delete(':id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}
}
