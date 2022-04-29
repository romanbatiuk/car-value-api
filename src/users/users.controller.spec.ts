import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
	let controller: UsersController;
	let fakeUsersService: Partial<UsersService>;
	let fakeAuthService: Partial<AuthService>;

	beforeEach(async () => {
		fakeUsersService = {
			findOne: (id: number) => {
				return Promise.resolve({ id, email: 'remi@mail.com', password: '12345' } as User);
			},
			find: (email: string) => {
				return Promise.resolve([{ id: 1, email, password: '12345' } as User]);
			},
			// remove: () => {},
			// update: () => {}
		};
		fakeAuthService = {
			// signup: () => {}
			signin: (email: string, password: string) => {
				return Promise.resolve({ id: 1, email, password } as User);
			},
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{ provide: UsersService, useValue: fakeUsersService },
				{ provide: AuthService, useValue: fakeAuthService },
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('findAllUsers returns a list of users with given email', async () => {
		const users = await controller.findAllUsers('remi@mail.com');
		expect(users.length).toEqual(1);
		expect(users[0].email).toEqual('remi@mail.com');
	});

	it('findUser returns a single user with given id', async () => {
		const user = await controller.findUser('1');
		expect(user).toBeDefined();
	});

	it('findUser throws an error if user with given id is not found', async () => {
		fakeUsersService.findOne = () => null;
		try {
			await controller.findUser('1');
		} catch (err) {}
	});

	it('signin updated session object and returns user', async () => {
		const sessios = { userId: -12 };
		const user = await controller.signin({ email: 'remi@mail.com', password: '12345' }, sessios);
		expect(user.id).toEqual(1);
		expect(sessios.userId).toEqual(1);
	});
});
