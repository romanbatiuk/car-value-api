import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

	async create(email: string, password: string) {
		const user = await this.usersRepository.create({ email, password });

		return await this.usersRepository.save(user);
	}

	async findOne(id: number) {
		return await this.usersRepository.findOneBy({ id });
	}

	async find(email: string) {
		return await this.usersRepository.findBy({ email });
	}

	async update(id: number, attrs: Partial<User>) {
		const user = await this.usersRepository.findOneBy({ id });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		Object.assign(user, attrs);
		return this.usersRepository.save(user);
	}

	async remove(id: number) {
		const user = await this.usersRepository.findOneBy({ id });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return this.usersRepository.remove(user);
	}
}
