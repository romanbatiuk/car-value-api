import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>;

	beforeEach(async () => {
		//* Create a fake copy of the users service

		const users: User[] = [];

		fakeUsersService = {
			find: (email: string) => {
				const filteredUsers = users.filter((user) => user.email === email);
				return Promise.resolve(filteredUsers);
			},
			create: (email: string, password: string) => {
				const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
				users.push(user);
				return Promise.resolve(user);
			},
		};

		const module = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: fakeUsersService,
				},
			],
		}).compile();

		service = module.get(AuthService);
	});

	it('can create an instance of auth service', async () => {
		expect(service).toBeDefined();
	});

	it('create a new user with a salted and hashed password', async () => {
		const user = await service.signup('remi@mail.com', '123456');
		expect(user.password).not.toEqual('123456');
		const [salt, hash] = user.password.split('.');
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	});

	it('throws an error if user signs up with email that is in use', async () => {
		await service.signup('home@mail.com', '123456');
		try {
			await service.signup('home@mail.com', '123456');
		} catch (err) {}
	});

	it('throws if singnin is called with an unused email', async () => {
		try {
			await service.signin('remi@mail.com', '123456');
		} catch (err) {}
	});

	it('throws if an invalid password is provided', async () => {
		await service.signup('home@mail.com', '123456');
		try {
			await service.signin('home@mail.com', 'password');
		} catch (err) {}
	});

	it('return a user if correct password is provided', async () => {
		await service.signup('remi@mail.com', '1234');
		const user = await service.signin('remi@mail.com', '1234');
		expect(user).toBeDefined();
	});
});
