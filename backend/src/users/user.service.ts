import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
	) {}

	async findByEmail(email: string): Promise<User | null> {
		return this.userRepo.findOne({ where: { email } });
	}

	async findAll(): Promise<User[]> {
		return this.userRepo.find();
	}

	async create(data: CreateUserDto): Promise<User> {
			const exists = await this.findByEmail(data.email);
			if (exists) {
				throw new ConflictException('El email ya está registrado');
			}
			const { confirmPassword, password, ...rest } = data;
		const hashed = await bcrypt.hash(password, 10);
		const user = this.userRepo.create({ ...rest, password: hashed });
		return this.userRepo.save(user);
	}

	async findOne(id: number): Promise<User> {
		const user = await this.userRepo.findOne({ where: { id } });
		if (!user) throw new NotFoundException('Usuario no encontrado');
		return user;
	}

	async update(id: number, data: Partial<CreateUserDto>): Promise<User> {
		const user = await this.findOne(id);
		if (data.email && data.email !== user.email) {
			const exists = await this.findByEmail(data.email);
			if (exists) throw new ConflictException('El email ya está registrado');
		}
		if (data.password) {
			const hashed = await bcrypt.hash(data.password, 10);
			(user as any).password = hashed;
		}
		Object.assign(user, {
			name: data.name ?? user.name,
			telephone: data.telephone ?? user.telephone,
			email: data.email ?? user.email,
			rol: data.rol ?? user.rol,
		});
		return this.userRepo.save(user);
	}

	async remove(id: number): Promise<{ message: string }> {
		const user = await this.findOne(id);
		await this.userRepo.remove(user);
		return { message: 'Usuario eliminado' };
	}
}
