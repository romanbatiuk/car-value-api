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
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}
	@Post('signup')
	createUser(@Body() body: CreateUserDto) {
		// return this.usersService.create(body.email, body.password);
		return this.authService.signup(body.email, body.password);
	}

	@Post('signin')
	signin(@Body() body: CreateUserDto) {
		return this.authService.signin(body.email, body.password);
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
